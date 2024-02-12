export class NoUserError extends Error {
  constructor() {
    super('There is no user with provided id.');
  }
}

export class InvalidUserIdError extends Error {
  constructor() {
    super('Invalid user id.');
  }
}

export class InvalidUserPayloadError extends Error {
  constructor() {
    super('Invalid user payload.');
  }
}

export class BadRequestError extends Error {
  constructor() {
    super('Bad request.');
  }
}

export class InvalidRouteError extends Error {
  constructor() {
    super('Invalid route.');
  }
}

export class InvalidJSONStructure extends Error {
  constructor() {
    super('Invalid JSON structure.');
  }
}
