export enum ApiHostOptions {
  AWS = "AWS",
  GCP = "GCP",
  AZURE = "Azure",
  HEROKU = "Heroku",
  DIGITALOCEAN = "DigitalOcean",
  VERCEL = "Vercel",
  NETLIFY = "Netlify",
  OTHER = "Other",
}

export enum ApiMonitoringOptions {
  ON = "on",
  OFF = "off",
}

export enum ApiSortOptions {
  LATEST = "Latest",
  OLDEST = "Oldest",
  A_Z = "A-Z",
  Z_A = "Z-A",
}

export enum ApiStatusOptions {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  PENDING = "pending",
}

export enum ApiQueryParamsEnum {
  STATUS = "status",
  MONITORING = "monitoring",
  SORT = "sort",
  SEARCH = "search",
  PAGE = "page",
  LIMIT = "limit",
  HOST = "host",
}
