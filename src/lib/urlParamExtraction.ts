const ONEPOINT_ID_PARAM = 'onepoint_id';

const ID_PARAM = 'id';

export function extractIdParam(): string {
  const params = new URLSearchParams(window.location.search);
  const onepointId = params.get(ONEPOINT_ID_PARAM);
  if (!!onepointId) {
    return onepointId;
  }
  const id = params.get(ID_PARAM);
  if (!!id) {
    return id;
  }
  return '';
}
