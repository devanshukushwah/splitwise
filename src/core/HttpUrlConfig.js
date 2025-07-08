export class HttpUrlConfig {
  static getBaseUrl() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
  }

  static getLoginUrl() {
    return `${this.getBaseUrl()}/login`;
  }

  static getRegisterUrl() {
    return `${this.getBaseUrl()}/register`;
  }

  static getPeopleUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/people`;
  }

  static postPeopleUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/people`;
  }

  static getSharesUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/shares`;
  }

  static postSharesUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/shares`;
  }

  static getEntriesUrl() {
    return `${this.getBaseUrl()}/entries`;
  }

  static postEntryUrl() {
    return `${this.getBaseUrl()}/entries`;
  }

  static getSpendsUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/spends`;
  }

  static putSpendsUrl(entry_id, spend_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/spends/${spend_id}`;
  }

  static postSpendUrl(entry_id) {
    return `${this.getBaseUrl()}/entries/${entry_id}/spends`;
  }
}
