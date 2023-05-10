export interface AWSUserAttribute {
  key: string;
}

export interface AWSUser {
  Username: string;
  Attributes: AWSUserAttribute[];
}
