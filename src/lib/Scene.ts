export interface Option {
  label: string;
  action: string;
  if: string;
}

export interface SceneMetadata {
  name: string;
  requirements?: string[];
  state?: {
    before?: string[];
    after?: string[];
  };
  options?: Option[];
}

export interface Scene {
  meta: SceneMetadata;
  body: string;
}
