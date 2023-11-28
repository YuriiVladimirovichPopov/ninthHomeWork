export function getSearchNameTermFromQuery(
  searchNameTerm: string | undefined,
): { searchNameTerm: string } {
  const defaultNameTerm = { searchNameTerm: "" };
  if (searchNameTerm) {
    defaultNameTerm.searchNameTerm = searchNameTerm;
    return defaultNameTerm;
  }
  return defaultNameTerm;
}

export function getSearchLoginTermFromQuery(
  searchLoginTerm: string | undefined,
): { searchLoginTerm: string } {
  const defaultLoginTerm = { searchLoginTerm: "" };
  if (searchLoginTerm) {
    defaultLoginTerm.searchLoginTerm = searchLoginTerm;
    return defaultLoginTerm;
  }
  return defaultLoginTerm;
}

export function getSearchEmailTermFromQuery(
  searchEmailTerm: string | undefined,
): { searchEmailTerm: string } {
  const defaultEmailTerm = { searchEmailTerm: "" };
  if (searchEmailTerm) {
    defaultEmailTerm.searchEmailTerm = searchEmailTerm;
    return defaultEmailTerm;
  }
  return defaultEmailTerm;
}
