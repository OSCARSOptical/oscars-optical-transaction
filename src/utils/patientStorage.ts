
import { Patient } from "@/types";

export const savePatientToStorage = (patient: Patient) => {
  localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
  localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
  localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
  localStorage.setItem(`patient_${patient.id}_email`, patient.email);
  localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
  localStorage.setItem(`patient_${patient.id}_address`, patient.address);
  if (patient.sex) {
    localStorage.setItem(`patient_${patient.id}_sex`, patient.sex);
  }
  localStorage.setItem(`patient_${patient.id}_code`, patient.code);
};
