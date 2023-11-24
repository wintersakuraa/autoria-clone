export const getDescriptionValidationMessage = (editCount: number) =>
  `Your car listing contains prohibited language. The listing is inactive. You have ${
    3 - editCount
  } chances to edit it.`;
