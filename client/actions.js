function action(type, payload = {}) {
  return {type, ...payload}
}

export const TEST_ACTION = 'TEST_ACTION'
export const testAction = (res) => action(TEST_ACTION, res)

export const BUTTON_CLICK = 'BUTTON_CLICK'
export const clickButton = (data) => action(BUTTON_CLICK, {data})