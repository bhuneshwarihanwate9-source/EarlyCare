-- ==============================================================================
-- EarlyCare Healthcare Telemetry Platform
-- Production Supabase Schema, RBAC Constraints, and Row Level Security (RLS)
-- Roles Enforced: 'patient', 'doctor', 'admin' ONLY.
-- ==============================================================================

-- 1. ENFORCE ROLE CHECK CONSTRAINT ON PROFILES
-- Ensures only valid, authorized EarlyCare roles can be persisted
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_user_role'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT check_user_role
        CHECK (role IN ('patient', 'doctor', 'admin'));
    END IF;
END $$;

-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL CORE TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'assessments') THEN
        ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prediction_results') THEN
        ALTER TABLE public.prediction_results ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clinical_notes') THEN
        ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'medical_records') THEN
        ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ==============================================================================
-- 3. HELPER FUNCTIONS FOR RBAC CHECKS IN RLS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- ==============================================================================
-- 4. POLICIES FOR PROFILES TABLE
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin() OR public.current_user_role() = 'doctor');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role or user can insert profile" ON public.profiles;
CREATE POLICY "Service role or user can insert profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

-- ==============================================================================
-- 5. POLICIES FOR PATIENTS TABLE
-- ==============================================================================

DROP POLICY IF EXISTS "Patients can view own patient record" ON public.patients;
CREATE POLICY "Patients can view own patient record"
    ON public.patients FOR SELECT
    USING (user_id = auth.uid() OR public.current_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "Patients can update own patient record" ON public.patients;
CREATE POLICY "Patients can update own patient record"
    ON public.patients FOR UPDATE
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Patients can insert own patient record" ON public.patients;
CREATE POLICY "Patients can insert own patient record"
    ON public.patients FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- 6. POLICIES FOR DOCTORS TABLE
-- ==============================================================================

DROP POLICY IF EXISTS "Anyone authenticated can view doctor directory" ON public.doctors;
CREATE POLICY "Anyone authenticated can view doctor directory"
    ON public.doctors FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Doctors can update own doctor record" ON public.doctors;
CREATE POLICY "Doctors can update own doctor record"
    ON public.doctors FOR UPDATE
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Doctors can insert own doctor record" ON public.doctors;
CREATE POLICY "Doctors can insert own doctor record"
    ON public.doctors FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- 7. POLICIES FOR ASSESSMENTS & PREDICTIONS
-- ==============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'assessments') THEN
        DROP POLICY IF EXISTS "Patients can view own assessments" ON public.assessments;
        CREATE POLICY "Patients can view own assessments"
            ON public.assessments FOR SELECT
            USING (
                patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
                OR public.current_user_role() IN ('doctor', 'admin')
            );

        DROP POLICY IF EXISTS "Patients can insert own assessments" ON public.assessments;
        CREATE POLICY "Patients can insert own assessments"
            ON public.assessments FOR INSERT
            WITH CHECK (
                patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
                OR public.current_user_role() IN ('patient', 'doctor', 'admin')
            );
    END IF;
END $$;

-- ==============================================================================
-- 8. POLICIES FOR CLINICAL NOTES
-- ==============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clinical_notes') THEN
        DROP POLICY IF EXISTS "Clinical notes visibility" ON public.clinical_notes;
        CREATE POLICY "Clinical notes visibility"
            ON public.clinical_notes FOR SELECT
            USING (
                patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
                OR doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
                OR public.is_admin()
            );

        DROP POLICY IF EXISTS "Doctors can insert clinical notes" ON public.clinical_notes;
        CREATE POLICY "Doctors can insert clinical notes"
            ON public.clinical_notes FOR INSERT
            WITH CHECK (
                public.current_user_role() = 'doctor'
                AND doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
            );
    END IF;
END $$;
