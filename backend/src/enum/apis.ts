export enum ApiHostOptions {
  AWS = "AWS",
  GCP = "GCP",
  Azure = "Azure",
  Heroku = "Heroku",
  DigitalOcean = "DigitalOcean",
  Other = "Other",
  //   Vercel = "Vercel",
}

export enum ApiMonitoringOptions {
  ON = "on",
  OFF = "off",
}

export enum ApiSortOptions {
  Latest = "Latest",
  Oldest = "Oldest",
  A_Z = "A-Z",
  Z_A = "Z-A",
}

export enum ApiStatusOptions {
  Healthy = "healthy",
  Unhealthy = "unhealthy",
  Pending = "pending",
}
