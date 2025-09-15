class UrlValidator {
  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  static isHttps(url) {
    return url.toLowerCase().startsWith("https://");
  }

  static extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return null;
    }
  }

  static sanitizeUrl(url) {
    // Remove any potentially dangerous characters
    return url.trim().replace(/[<>'"]/g, "");
  }
}

export { UrlValidator };
