interface MyObject {
  id: string;
  lastModified: Date;
  summary: string;
}

function generateRandomId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function generateRandomLastModifiedDate(): Date {
  const startDate = new Date(2020, 0, 1); // Start date for random date generation
  const endDate = new Date(); // Current date
  const randomDate = new Date(
    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  );
  return randomDate;
}

export function generateObjectsArray(): MyObject[] {
  const objectsArray: MyObject[] = [];

  for (let i = 0; i < 16; i++) {
    const newObj: MyObject = {
      id: generateRandomId(),
      lastModified: generateRandomLastModifiedDate(),
      summary: `Summary ${i + 1}`,
    };
    objectsArray.push(newObj);
  }

  return objectsArray;
}
