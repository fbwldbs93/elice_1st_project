const overlapCheck = (state, title) => {
    const filtered = state.filter((project) => project.title === title);

    if (filtered.length === 1) {
        return true;
    }

    return false;
}

const projectsReducer = (dispatch) => {
    const setNotices = dispatch;

    const reducer = (state, action) => {
        const { title, detail, date, handleForm, index } = action.payload;
    
        switch (action.type) {
            case "add": {
                handleForm();

                if (overlapCheck(state, title)) {
                    setNotices({type: "warn", payload: {title: "프로젝트", message: "이미 있는 내용입니다."}});
                    return state;
                }
                
                setNotices({type: "success", payload: {title: "프로젝트", message: "추가되었습니다."}});
                
                return [ ...state, {title, detail, date} ];
            }
            
            case "remove": {
                const newState = state.filter((project) => !(project.title === title));
    
                setNotices({type: "success", payload: {title: "프로젝트", message: "삭제되었습니다."}});
                return newState;
            }
    
            case "edit": {
                handleForm();
                const newState = [ ...state ];
    
                newState[index] = { ...newState[index], title, detail, date };
                
                if (overlapCheck(state, title)) {
                    setNotices({type: "warn", payload: {title: "프로젝트", message: "이미 있는 내용입니다."}});
                    return state;
                }
    
                setNotices({type: "success", payload: {title: "프로젝트", message: "수정되었습니다."}});
                return newState;
            }
    
            case "load": {
                const { setTitle, setDetail, setStartDate, setEndDate } = action.payload;
                    const project = state[index];
                    const dates = project.date.split(" ~ ");
    
                    setTitle(project.title);
                    setDetail(project.detail);
                    setStartDate(new Date(dates[0]));
                    setEndDate(new Date(dates[1]));

                return state;
            }
            default:
                return state;
        }
    }

    return reducer;
}

export default projectsReducer;