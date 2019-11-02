const AdminReducer = (state = false, action) => {
    switch (action.type) {
        case 'SETADMIN':
            return action.payload;
        default:
            return state;
    }
}

export default AdminReducer;