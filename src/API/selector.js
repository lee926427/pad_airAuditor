export const getUser = {
    token: state => state.app.token,
}
export const getFilter = {
    range: state => state.filter.selectedRange,
    index: state => state.filter.selectedIndex
}
export const getApp = {
    selectedTime: state => state.app.selectedTime
}
export const getMap = {
    searchPin: state => state.map.searchPin
}
