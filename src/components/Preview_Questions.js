import React from "react";
import Modal from "react-modal";
//import Button from "@material-ui/core/Button";
import { Fragment } from "react";
import '../App.css';
import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label1,
  fieldBox,
  fieldBox1,
  selectField,
  datePicker
} from "./Styles";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import {
  ConfigIcon,
  NewClientIcon,
  ExistingClientIcon
} from "./icons";
import { baseApiUrl } from '../api/api';

const logout = {
  position: "relative",
  top: "-25px",
  right: "25px",
  radius: "2px",

}

const profile = {
  position: "relative",
  top: "-25px",
  right: "-1 0px",
  radius: "2px"

}
const nav = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  marginTop: "80px",
  '@media all and (min-width:  "520px)': {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  }
}


const menuButton1 = {
  width: "250px",
  height: "50px",
  backgroundColor: "#f5f5f5",
  '@media all and (max-width: 520px)': {
    width: "70px",
    height: "35px",
    fontSize: "6px !important",
  },
  '@media all and (max-width: 768px)': {
    fontSize: "6px",
  },
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  textTransform: "uppercase",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px !important",
  fontSize: "12px",
  color: "#ffffff !important",
  marginRight: "2px",
  '@media all and (min-width: 520px)': {
    // :not(:last-child) {
    borderRight: "2px solid #c4c4c4 !important",
    // }
  }
}
const menuIcon = {
  fontSize: "72px !important",
  marginBottom: "8px",
  backgroundColor: "#f5f5f5", color: "#9d9d9d",
  '@media all and (maxWidth: "520px")': {
    fontSize: "36px !important"
  }
}
const logo = {
  position: "relative",
  top: "0.5%"
}

const firstMatchLogo = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "20px",
  '@media all and (max-width: 520px)': {
    width: "80px"
  }
}

const adelphoiLogo = {
  position: "absolute",
  top: "-25px",
  left: "-12px",
  '@media all and (max-width: 520px)': {
    top: "0",
    right: "0"
  }
}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
export class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      isSuccess: false,
      hasError: true,
      isSubmitted: false,
      DynamicQuestions: [],
      error: [],
      errors: "",
      client_form: [],
      Required_List: [],
      prevJump: [],
      prevQuestionJump: [],
      csvfile: "",
      err_msg: [],
      isOpen: false,
      isEdit: this.props.isEdit
    };
  }
  async componentDidMount() {
    this.formState();
    this.setState({
      isOpen: this.props.errors ? true : false,
      err_msg: this.props.errors,
    })

  }
  formState = () => {
    let client_form = [];
    let Required_List = [];
    this.props.DynamicQuestions.map
      (sec => sec.related === "false" && sec.questions && sec.questions.map(ques => {
        client_form.push({
          [ques.question.replace(/ /g, "_")]:
            Array.isArray(ques.answer) ? ques.suggested_answers.map((q, j) => ques.answer.includes(q.value) &&
              q.id.toString()).filter(item => item !== false) :
              ques.answer === 0 ? ques.answer.toString() :
                ques.suggested_answers.length >= 1 ? ques.answer &&
                  ques.suggested_answers.filter((p, i) => p.value === ques.answer)[0].id.toString()
                  : ques.answer ? ques.answer.toString() : ""
        });
        Required_List.push({
          [ques.question.replace(/ /g, "_")]: ques.required
        });
      }))
    this.setState({
      DynamicQuestions: this.props.DynamicQuestions,
      client_form: Object.assign({}, ...client_form),
      Required_List: Object.assign({}, ...Required_List),
    })
  }
  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  getAge = (date, fromDate) => {
    if (!date) {
      return "";
    }
    let today;
    if (!fromDate) {
      today = new Date();
    } else {
      today = new Date(fromDate);
    }
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  }

  handleChange = async (e) => {
    const { name, value } = e.target;
    let DynamicQuestions = this.state.DynamicQuestions;
    let val1 = e.target.dataset.val1 ? e.target.dataset.val1 : "";
    const val2 = e.target.dataset.val2 ? e.target.dataset.val2 : "";
    const type = e.target.dataset.type;
    const error_msg = e.target.dataset.msg;
    let jump = "";
    let ques_jump = "";
    if (type === "select") {
      let optionElement = e.target.childNodes[e.target.selectedIndex]
      let idx = optionElement.getAttribute('data-idx');
      jump = optionElement.getAttribute('data-jump');
      ques_jump = optionElement.getAttribute('data-quesjump');
      let jumpto = jump.split(',').filter(j => j)
      let ques_jumpto = ques_jump.split(',').filter(j => j)
      this.setState({
        prevJump: {
          ...this.state.prevJump,
          [name.replace(/ /g, "_")]: jumpto,
          hasError: false,
        },
        prevQuestionJump: {
          ...this.state.prevQuestionJump,
          [name.replace(/ /g, "_")]: ques_jumpto,
          hasError: false,
        }

      })
      DynamicQuestions[idx].questions.map((que, i) =>
        ques_jumpto.includes(que.question)
          ? (DynamicQuestions[idx].questions[i].related = "no")
          : (this.state.prevQuestionJump[name.replace(/ /g, "_")] &&
            this.state.prevQuestionJump[name.replace(/ /g, "_")].includes(que.question) && (
              DynamicQuestions[idx].questions[i].related = "yes"
            )))
      DynamicQuestions.map((sec, i) => jumpto.includes(sec.section) ? (
        DynamicQuestions[i].related = "false"
      )
        :
        this.state.prevJump[name.replace(/ /g, "_")] && this.state.prevJump[name.replace(/ /g, "_")].includes(sec.section) && (
          DynamicQuestions[i].related = "true"
        )
      )

    } else {
      if (type === "radio") {
        jump = e.target.dataset.jump.split(',').filter(j => j);
        ques_jump = e.target.dataset.quesjump.split(',').filter(j => j);
        const idx = e.target.dataset.idx;
        this.setState({
          prevJump: {
            ...this.state.prevJump,
            [name.replace(/ /g, "_")]: jump,
            hasError: false,
          },
          prevQuestionJump: {
            ...this.state.prevQuestionJump,
            [name.replace(/ /g, "_")]: ques_jump,
            hasError: false,
          }
        })
        DynamicQuestions[idx].questions.map((que, i) =>
          ques_jump.includes(que.question)
            ? (DynamicQuestions[idx].questions[i].related = "no")
            : (this.state.prevQuestionJump[name.replace(/ /g, "_")] &&
              this.state.prevQuestionJump[name.replace(/ /g, "_")].includes(que.question) && (
                DynamicQuestions[idx].questions[i].related = "yes"
              )))

        DynamicQuestions.map((sec, i) => jump.includes(sec.section) ? (
          DynamicQuestions[i].related = "false")
          :
          this.state.prevJump[name.replace(/ /g, "_")] && this.state.prevJump[name.replace(/ /g, "_")].includes(sec.section) && (
            DynamicQuestions[i].related = "true"
          )
        )
      }

    }

    if (val1 === "") {
      if (type === "checkbox") {
        const checked = e.target.checked;
        this.setState({
          client_form: {
            ...this.state.client_form,
            [name]: this.state.client_form[name] ?
              checked ? this.state.client_form[name].concat([value]) :
                this.state.client_form[name].filter(idy => idy !== value) : [value]
          },
          hasError: false,
        })
      } else {
        this.setState({
          client_form: {
            ...this.state.client_form,
            [name]: value
          },
          hasError: false,
        })
      }
      if (jump) {
        let client_form1 = [];
        let Required_List1 = [];
        DynamicQuestions.map
          (sec => sec.related === "false" && sec.questions && sec.questions.map(ques => {
            client_form1.push({
              [ques.question.replace(/ /g, "_")]:
                Array.isArray(ques.answer) ? ques.answer :
                  ques.answer === 0 ?
                    ques.answer : ques.suggested_answers.length >= 1 ? ques.answer ?
                      ques.suggested_answers.filter((p, i) => p.value === ques.answer)[0].id : ques.answer ? ques.answer : "" : ""
            });
            Required_List1.push({
              [ques.question.replace(/ /g, "_")]: ques.required
            });
          }))
        let formData = Object.assign({}, ...client_form1)
        let ReqData = Object.assign({}, ...Required_List1)
        let client_form = this.state.client_form;
        let Required_List = this.state.Required_List;
        client_form = {
          ...formData, ...client_form, [name]: value
        }
        Required_List = {
          ...ReqData, ...Required_List
        }
        this.setState({
          client_form,
          Required_List
        })
      }
      //  else if (this.state.prevJump[name]) {
      //   this.formState();
      // }

    }
    else {
      if (type === "number") {
        const err = parseInt(value) < parseInt(val1)
        const err1 = parseInt(value) > parseInt(val2)

        this.setState({
          client_form: {
            ...this.state.client_form,
            [name]: value,
          },
          error: {
            ...this.state.error,
            [name]: err === true ? error_msg : err1 === true ? error_msg : "",
          },
          hasError: err === true ? true : err1 === true ? true : false
        })
      } else {
        const regex = val2 === "Both" ? "^[A-Za-z ]+$" :
          val2 === "Numbers" ? "^[ A-Za-z_@./#&+-]*$" :
            val2 === "Special characters" ? "^[A-Za-z0-9 ]+$" : ""
        const textRegex = new RegExp(regex);
        this.setState({
          client_form: {
            ...this.state.client_form,
            [name]: value,
          },
          error: {
            ...this.state.error,
            [name]: textRegex.test(value) ? "" : error_msg,
          },
          hasError: textRegex.test(value) ? false : true
        })
      }
    }

  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const client_form = this.state.client_form;
    let Required_List = this.state.Required_List;
    this.setState({
      isSubmitted: true,
      err_msg: [],
      isOpen: false,
    })
    let data = [];
    let isValid_Data = true;
    Object.keys(client_form).map((ele, i) =>
    (data.push({ [ele.replace(/_/g, ' ')]: client_form[ele] }),
      !client_form[ele] && Required_List[ele] === "yes" && (isValid_Data = false)
    ))
    const formData = Object.assign({}, ...data)
    if (isValid_Data) {
      alert("New Client Added Successfully")
    }
  }

  uploadCSV = async (e) => {
    e.preventDefault()
    let { name } = e.target;
    let file = e.target.files[0]
    this.setState({
      csvfile: file
    })
  }

  uploadFile = async () => {
    const file = this.state.csvfile;
    const formData = new FormData();
    formData.append('clients_file', file)

  }

  downloadCSV = async (e) => {

  }

  display = (id) => {
    const tempArray = [];
    let questions = this.state.DynamicQuestions[id].questions && this.state.DynamicQuestions[id].questions;
    const length = questions && questions.length
    for (let i = 0; i < length; i++) {
      if ((i + 1) % 2 !== 0) {
        var tempArray1 = [];
        tempArray1.push(questions[i]);
        if (length === i + 1) {
          tempArray.push(tempArray1)
        }
      }
      else {
        tempArray1.push(questions[i]);
        tempArray.push(tempArray1)
      }

    }
    return tempArray

  }

  render() {
    const { DynamicQuestions } = this.state;
    const { errors, logoPath, headerColor } = this.props;
    const menuButton = {
      width: "250px",
      height: "50px",
      backgroundColor: headerColor,
      '@media all and (max-width: 520px)': {
        width: "70px",
        height: "35px",
        fontSize: "6px !important",
      },
      '@media all and (max-width: 768px)': {
        fontSize: "8px",
      },
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      textTransform: "uppercase",
      display: "flex",
      flexDirection: "column",
      borderRadius: "0px !important",
      fontSize: "12px",
      color: "#ffffff",
      marginRight: "2px",
      '@media all and (min-width: 520px)': {
        // :not(:last-child) {
        borderRight: "2px solid #c4c4c4 !important",
        // }
      }
    }
    return (
      <Fragment>
        <div style={logo}>
          <img
            style={firstMatchLogo}
            alt="Logo"
            src={`${baseApiUrl}/${logoPath}`}
          />
        </div>
        <div style={nav}>
          <Link style={menuButton} > Dashboard </Link>
          <Link style={menuButton1} > New Client </Link>
          <Link style={menuButton} > Existing Client</Link>
          <Link style={menuButton}> Notifications</Link>
          <Link style={menuButton}>  Billing  </Link>
          <Link style={menuButton}>  Account  </Link>
          <Link style={menuButton} > Users </Link>
          <Link style={menuButton} > Logout </Link>
       </div>
        <div style={wrap}>

          <div style={mainContent}>
            {DynamicQuestions &&
              <div style={fieldRow}
              // style={{ justifyContent: "center" }}
              >
                <button
                  type="submit"
                  size="small"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 10, backgroundColor: headerColor }}
                  className="btn btn-primary"
                  onClick={this.downloadCSV}
                >
                  Download CSV template
            </button>
                <div className={profile}>
                  <input name="uploadfile" type="file" onChange={this.uploadCSV} />
                  <button
                    type="submit"
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={this.uploadFile}
                    className="btn btn-primary"
                    style={{ marginRight: 10, backgroundColor: headerColor }}>Upload</button>
                </div>
              </div>
            }
            <Modal
              isOpen={this.state.isOpen}
              ariaHideApp={false}
              onRequestClose={this.handleClose}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div>
                <h1 style={subHeading}>Please correct the following errors and try again.</h1>
                {this.state.err_msg && this.state.err_msg.map((e, i) => <div style={{ color: "red" }}>{this.state.err_msg[i]}</div>)}

              </div>

            </Modal>
            <form name="newClientForm" onChange={this.handleChange} onSubmit={this.handleSubmit}>

              {DynamicQuestions.map((sections, index) =>
                sections.related === "true" ? "" :
                  <React.Fragment>

                    <h1 style={subHeading,{color: headerColor}}>{sections.section}</h1>
                    {

                      this.display(index).map((item, ind) => {
                        return <div style={fieldRow}>{item.map((ques, index_1) =>
                          ques.related !== "yes" &&
                          (<div style={twoCol}>
                            <label style={label1} >{ques.question}</label>
                            {ques.description &&
                              <label style={{ fontSize: "16px" }}> ({ques.description})</label>
                            } <br />

                            {ques.answer_type === "SELECT" ?
                              <select
                                style={selectField}
                                name={ques.question.replace(/ /g, "_")}
                                data-type={ques.answer_type.toLowerCase()}
                                data-length={ques.suggested_jump.length}

                              >
                                <option value="">Select</option>
                                {ques.suggested_answers.map((ans, i) =>

                                  <option key={i}
                                    value={ans.id}
                                    data-idx={index}
                                    data-idy={ind}
                                    data-jump={ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "")}
                                    data-quesjump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.question_jumpto ? sj.question_jumpto : "" : "") : ""}
                                    selected={this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")].toString() === ans.id.toString()}>{ans.value}</option>
                                )}
                              </select>
                              :
                              ques.answer_type === "RADIO" ?
                                <React.Fragment>
                                  {ques.suggested_answers.map((ans, i) =>
                                    <div
                                      style={fieldBox1}
                                    //style={{ width: "47.8%", display: "inline-block" }}
                                    >
                                      <React.Fragment>
                                        <input
                                          type="radio"
                                          data-jump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "") : ""}
                                          data-quesjump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.question_jumpto ? sj.question_jumpto : "" : "") : ""}
                                          data-idx={index}
                                          data-idy={ind}
                                          name={ques.question.replace(/ /g, "_")} value={ans.id}
                                          checked={this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id.toString() ? true :
                                            this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id}
                                          data-type={ques.answer_type.toLowerCase()}
                                        />{" "}
                                        <label htmlFor={i}>{ans.value}</label>
                                      </React.Fragment>

                                    </div>

                                  )}
                                </React.Fragment>
                                :
                                ques.answer_type === "CHECKBOX" ?

                                  ques.suggested_answers.map((ans, i) =>
                                    <div
                                      style={fieldBox1}
                                    //style={{ width: "47.8%", display: "inline-block" }}
                                    >
                                      <React.Fragment>
                                        <input
                                          type="checkbox"
                                          name={ques.question.replace(/ /g, "_")}
                                          value={ans.id}
                                          //required={ques.required === "yes" ? true : false} 
                                          data-type={ques.answer_type.toLowerCase()}
                                          data-idx={index}
                                          data-idy={ans.id}
                                          data-idz={ques.id}
                                          checked={this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")].includes(ans.id.toString())
                                            || this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")].includes(ans.value)}
                                        />{" "}

                                        <label htmlFor={ans}>{ans.value}</label>
                                      </React.Fragment>
                                    </div>
                                  )
                                  :
                                  ques.answer_type === "NUMBER" ?
                                    <Fragment>
                                      <input
                                        style={inputField}
                                        data-val1={ques.validation1}
                                        data-val2={ques.validation2}
                                        data-type={ques.answer_type.toLowerCase()}
                                        data-msg={ques.error_msg}
                                        data-idx={index}
                                        data-idy={ind}
                                        readOnly={ques.field_type === 0}
                                        name={ques.question.replace(/ /g, "_")}
                                        value={ques.question === "Age" ? (
                                          this.state.client_form[ques.question.replace(/ /g, "_")] = this.getAge(this.state.client_form["Date_of_Birth"], this.state.client_form["Date_of_Referral"])
                                        )
                                          : this.state.client_form[ques.question.replace(/ /g, "_")]}
                                        type={ques.answer_type.toLowerCase()}
                                        onBlur={this.keyUp}
                                      />

                                    </Fragment>

                                    :
                                    <Fragment>
                                      <input
                                        style={inputField}
                                        data-val1={ques.validation1}
                                        data-val2={ques.validation2}
                                        data-type={ques.answer_type.toLowerCase()}
                                        data-msg={ques.error_msg}
                                        data-idx={index}
                                        data-idy={ind}
                                        name={ques.question.replace(/ /g, "_")}
                                        value={this.state.client_form[ques.question.replace(/ /g, "_")]}
                                        type={ques.answer_type.toLowerCase()}

                                      />

                                    </Fragment>
                            }
                            {this.state.isSubmitted === true ? this.state.error[ques.question.replace(/ /g, "_")] ?
                              <div style={{ color: "red" }}>{this.state.error[ques.question.replace(/ /g, "_")]}</div> : this.state.client_form[ques.question.replace(/ /g, "_")] ? "" :
                                ques.required === "yes" ? <div style={{ color: "red" }}>Required</div> : "" : ""}
                          </div>
                          ))}</div>

                      })
                    }
                  </React.Fragment>
              )}
              <div
                className="d-flex justify-content-end"
              >
                <button
                  type="submit"
                  variant="contained"
                  size="large"
                  className="btn btn-primary"
                  style={{ marginRight: 10,backgroundColor: headerColor }}
                >
                  Submit
                                </button>
              </div>
            </form>

          </div>

        </div>
      </Fragment>

    );
  }
};

export default Preview;

