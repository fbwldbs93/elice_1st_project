import * as API from "../../../api";
import { TYPES } from "../../util/util";

const educationHandler = (dispatcher) => {
  const dispatch = dispatcher;

  const add = async (school, major, degree, handleForm, index) => {
    dispatch({ type: TYPES.add, payload: { school, major, degree } });

    handleForm();

    try {
      const res = await API.post("users/education", {
        school,
        major,
        degree,
      });

      const education_id = await res.data._id;

      dispatch({ type: TYPES.setID, payload: { education_id, index } });
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (education_id, school) => {
    dispatch({ type: TYPES.remove, payload: { school } });

    try {
      await API.delete("users/education", education_id);
    } catch (err) {
      console.log(err);
    }
  };

  const edit = async (
    education_id,
    school,
    major,
    degree,
    handleForm,
    index
  ) => {
    dispatch({ type: TYPES.edit, payload: { school, major, degree, index } });

    handleForm();

    try {
      await API.put("users/education", {
        _id: education_id,
        school,
        major,
        degree,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const load = (index, setFormData) => {
    dispatch({ type: TYPES.load, payload: { index, setFormData } });
  };

  const init = (initialData) => {
    initialData.data.map((data) => {
      const { _id, school, major, degree } = data;

      dispatch({
        type: TYPES.init,
        payload: { education_id: _id, school, major, degree },
      });
    });
  };

  return { add, remove, edit, load, init };
};

export default educationHandler;
