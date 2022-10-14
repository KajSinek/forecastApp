import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mess, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMessChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = "http://localhost:8080/record";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mess }),
    };
    fetch(url, requestOptions)
      .then((response) => console.log("Submitted successfully"))
      .catch((error) => console.log("Form submit error", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        E-mail:
        <input type="email" name="email" onChange={handleEmailChange} />
      </label>
      <label>
        Name:
        <input type="text" name="name" onChange={handleNameChange} />
      </label>
      <label>
        Message:
        <textarea type="text" name="mess" onChange={handleMessChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
