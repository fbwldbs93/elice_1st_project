import * as API from "../../../api";
import { TYPES, overlapCheck } from "../../util/util";

const projectsHandler = (dispatcher) => {
    const dispatch = dispatcher;
    
    const add = async (title, detail, date, handleForm, index) => {
        dispatch({type: TYPES.add, payload: {title, detail, date}});
        console.log("added")

        handleForm();

        const res = await API.post("users/project", 
            {
                title,
                detail,
                date
            });

        const project_id = await res.data._id;

        dispatch({type: TYPES.setID, payload: {project_id, index}});
    }

    const remove = async (project_id, title) => {
        dispatch({type: TYPES.remove, payload: {title}});

        console.log(project_id)
        try {
            await API.delete("users/project", project_id);
        } catch (err) {
            console.log(err);
        }
    }

    const edit = async (project_id, title, detail, date, handleForm, index) => {
        dispatch({type: TYPES.edit, payload: {title, detail, date, index}});

        handleForm();
        
        await API.put("users/project", {
            _id: project_id,
            title,
            detail,
            date,
        });
    }

    const load = (index, setTitle, setDetail, setStartDate, setEndDate) => {
        dispatch({type: TYPES.load, payload: {index, setTitle, setDetail, setStartDate, setEndDate}});
    }

    const init = (initialData) => {
        initialData.data.map((data) =>{
            const {_id, title, detail, date} = data;

            dispatch({type: TYPES.init, payload: {project_id: _id, title, detail, date}});
        });
    }

    return {add, remove, edit, load, init};
}

export default projectsHandler;