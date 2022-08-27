export interface ApiQueryParams {
      createdBy: string;
      status?: string;
      monitoring?: string;
      url?: { $regex: string; $options: string };
    }