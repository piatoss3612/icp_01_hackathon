import Accordion from "../components/base/Accordion";
import AccordionHeader from "../components/base/AccordionHeader";
import Button from "../components/base/Button";
import Card from "../components/base/Card";
import Checkbox from "../components/base/Checkbox";
import Image from "../components/base/Image";
import Select from "../components/base/Select";
import TextInput from "../components/base/TextInput";
import { Colors } from "../constants/Colors";
import { AiOutlineSearch } from 'react-icons/ai';

import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const Create = () => {
  const { identity } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      Swal.fire({
        title: "Login Required",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
  }, [identity]);

  if (!identity) {
    return (
      <div style={{ marginTop: "100px", color: "white" }}>
        <h1>Create</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "100px", color: "white" }}>
      <h1>Create</h1>
    </div>
  );
}

export default Create;
