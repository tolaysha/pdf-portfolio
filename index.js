const hl7 = `dfdf`
// Разделим на сегменты
const segments = hl7.trim().split(/\r?\n/);

// Хранилища для нужных сегментов
let pid = null;

for (const segment of segments) {
  if (segment.startsWith("PID|")) {
    pid = segment.split("|");
  }
}

if (!pid) {
  throw new Error("No PID segment found in HL7 message");
}

// Пример: PID сегмент
// PID|1||M000001582^^^^MR^BMH~...||Zqmja^Hsne^^^^^L||****0427|F||WH|524 Oix Vm...

const fhirPatient = {
  resourceType: "Patient",
  identifier: [
    {
      system: "urn:MR:BMH",
      value: pid[3]?.split("~")[0] || "Unknown",
    }
  ],
  name: [
    {
      family: pid[5]?.split("^")[0] || "",
      given: [pid[5]?.split("^")[1] || ""]
    }
  ],
  gender: pid[8]?.toLowerCase() === "f" ? "female" : (pid[8]?.toLowerCase() === "m" ? "male" : "unknown"),
  birthDate: pid[7]?.replace("****", "1900") || "1900-01-01", // костыль — замена маскированной даты
  address: [
    {
      line: [pid[11]?.split("^")[0] || ""],
      city: pid[11]?.split("^")[2] || "",
      state: pid[11]?.split("^")[3] || "",
      postalCode: pid[11]?.split("^")[4] || "",
      country: pid[11]?.split("^")[5] || ""
    }
  ],
  telecom: pid[13] ? [{
    system: "phone",
    value: pid[13]?.split("^")[0],
    use: "mobile"
  }] : []
};

console.log(JSON.stringify(fhirPatient, null, 2));
// Вывод FHIR Patient в консоль
