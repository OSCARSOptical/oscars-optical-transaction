
import PatientList from '@/components/patients/PatientList';

const Patients = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Patients</h2>
        <p className="text-muted-foreground">Manage your patient records</p>
      </div>
      <PatientList />
    </div>
  );
};

export default Patients;
