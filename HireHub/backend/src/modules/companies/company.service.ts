import { Company } from "../../models/Company";

export async function createCompany(ownerId: string, data: Record<string, unknown>) {
  return Company.create({ ...data, ownerId });
}

export async function getCompanyById(id: string) {
  return Company.findById(id);
}

export async function getCompanyByOwner(ownerId: string) {
  return Company.findOne({ ownerId });
}

export async function updateCompany(id: string, ownerId: string, data: Record<string, unknown>) {
  const company = await Company.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: data },
    { new: true }
  );
  if (!company) {
    const err = new Error("Company not found or not owned") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  return company;
}

export async function deleteCompany(id: string, ownerId: string) {
  const res = await Company.deleteOne({ _id: id, ownerId });
  if (res.deletedCount === 0) {
    const err = new Error("Company not found or not owned") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
}