const overlapCheck = (state, title) => {
    const filtered = state.filter((project) => project.title === title);

    if (filtered.length === 1) {
        return true;
    }

    return false;
}

const certificateReducer = (dispatch) => {
    const setNotices = dispatch;

    const reducer = (state, action) => {
        const { title, detail, date, handleForm, index } = action.payload;
    
        switch (action.type) {
            case "add": {
                handleForm();
    
                if(overlapCheck(state, title)) {
                    setNotices({type: "warn", payload: {title: "자격증", message: "이미 있는 자격증입니다."}});

                    return state;
                }
    
                setNotices({type: "success", payload: {title: "자격증", message: "추가되었습니다."}});
                
                return [ ...state, {title, detail, date} ];
            }
                    
            case "remove": {
                const newState = state.filter((certificate) => !(certificate.title === title));
                setNotices({type: "success", payload: {title: "자격증", message: "삭제되었습니다."}});

                return newState;
            }
    
            case "edit": {
                handleForm();
                const newState = [ ...state ];
    
                newState[index] = { ...newState[index], title, detail, date };
                
                if(overlapCheck(state, title)) {
                    setNotices({type: "warn", payload: {title: "자격증", message: "이미 있는 자격증입니다."}});
                    return state;
                }
                
                setNotices({type: "success", payload: {title: "자격증", message: "수정되었습니다."}});

                return newState;
            }
    
            case "load": {
                const { setTitle, setDetail, setDate } = action.payload;
                    const certificate = state[index];
    
                    setTitle(certificate.title);
                    setDetail(certificate.detail);
                    setDate(new Date(certificate.date));
            }

            default:
                return state;
        }
    }
    
    return reducer;
}

export default certificateReducer;