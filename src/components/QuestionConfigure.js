import React, { Fragment } from 'react';
import { saveClientConfigure, fetchConfigureQuestions } from '../api/api';
import Preview from './Preview_Questions';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BeatLoader } from 'react-spinners';

import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs';

const animatedComponents = makeAnimated();
const customStyles = {
    content: {
        position: 'absolute',
        width: '70%',
        top: '35%',
        marginTop: '-150px',
        left: '20%',
        right: '10%',
        marginLeft: '-100px',
        height: 'auto',
        overflow: 'scroll',
        border: '1px solid black'
    }
};
const colourStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '0px dotted green',
        color: state.isSelected ? 'yellow' : 'black',
        backgroundColor: state.isSelected ? 'green' : 'white'
    }),
    control: (provided) => ({
        ...provided,
        marginTop: '5%'
    })
};
class QuestionConfigure extends React.Component {
    constructor() {
        super();
        this.state = this.getInitialState();
    }
    getInitialState() {
        return {
            sections: [
                {
                    section: 'Demographics',
                    section_id: 0,
                    related: 'false',
                    questions: [
                        {
                            question_id: 0,
                            question: 'Client Code',
                            description: '',
                            field_type: '1',
                            answer_type: 'NUMBER',
                            suggested_answers: [''],
                            suggested_jump: [''],
                            validation1: '100',
                            validation2: '99999',
                            error_msg: 'Should be range between 100 - 99999',
                            re_type: 'no',
                            is_to_be_mask: 'no',
                            related: 'no',
                            required: 'yes',
                            flag: '0'
                        },
                        {
                            question_id: 1,
                            question: 'First Name',
                            description: '',
                            field_type: '1',
                            answer_type: 'TEXT',
                            suggested_answers: [''],
                            suggested_jump: [''],
                            validation1: 'Contains',
                            validation2: 'Both',
                            error_msg: 'Should not contain special characters',
                            re_type: 'no',
                            is_to_be_mask: 'no',
                            related: 'no',
                            required: 'yes',
                            flag: '0'
                        },
                        {
                            question_id: 2,
                            question: 'Last Name',
                            description: '',
                            field_type: '1',
                            answer_type: 'TEXT',
                            suggested_answers: [''],
                            suggested_jump: [''],
                            validation1: 'Contains',
                            validation2: 'Both',
                            error_msg: 'Should not contain special characters',
                            re_type: 'no',
                            is_to_be_mask: 'no',
                            related: 'no',
                            required: 'yes',
                            flag: '0'
                        }
                    ]
                }
            ],
            lastItemId: 3,
            lastSectionId: 0,
            Org_id: '',
            org_type: '',
            readOnly: '',
            isPreview: false,
            isOpen: false,
            logoPath: '',
            header_color: '',
            hasError: false,
            err_msg: [],
            isLoading: false,
            relatedSections: [],
            relatedQuestions: []
        };
    }
    handleNavToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    handleNavToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    };
    handleScroll = () => {
        let mybuttonTop = document.getElementById('btn-back-to-top');
        let mybuttonBottom = document.getElementById('btn-back-to-bottom');

        if (mybuttonTop || mybuttonBottom) {
            if (document.body.scrollTop > 99 || document.documentElement.scrollTop > 99) {
                mybuttonTop.style.display = 'block';
            } else {
                mybuttonTop.style.display = 'none';
            }
            if (document.documentElement.scrollHeight - 1033 < document.documentElement.scrollTop) {
                mybuttonBottom.style.display = 'none';
            } else {
                mybuttonBottom.style.display = 'block';
            }
        }
    };
    componentDidMount = async () => {
        let lastSection = {
            section: 'Outcomes',
            section_id: this.state.sections.length,
            related: 'false',
            questions: [
                {
                    question_id: 0,
                    question: 'Referral Status',
                    description: '',
                    field_type: '1',
                    answer_type: 'RADIO',
                    suggested_answers: [
                        { id: 0, value: 'Pending', isChecked: true },
                        { id: 1, value: 'Placed', isChecked: false },
                        { id: 2, value: 'Rejected', isChecked: false },
                        { id: 3, value: 'Not Placed', isChecked: false }
                    ],
                    suggested_jump: [
                        { answer: 'Pending', jumpto: [], question_jumpto: ['Program'] },
                        {
                            answer: 'Placed',
                            jumpto: [],
                            question_jumpto: ['Program', 'Start Date', 'Program Completion', 'End Date', 'Remain Out of Care']
                        },
                        {
                            answer: 'Rejected',
                            jumpto: [],
                            question_jumpto: ['Reason for Rejection']
                        },
                        {
                            answer: 'Not Placed',
                            jumpto: [],
                            question_jumpto: ['Program', 'Start Date']
                        }
                    ],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'no',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 1,
                    question: 'Program',
                    description: '',
                    field_type: '1',
                    answer_type: 'SELECT',
                    suggested_answers: [
                        { id: 0, value: 'yes', isChecked: false },
                        { id: 1, value: 'no', isChecked: false }
                    ],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'yes',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 2,
                    question: 'Start Date',
                    description: '',
                    field_type: '1',
                    answer_type: 'DATE',
                    suggested_answers: [],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'yes',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 3,
                    question: 'Program Completion',
                    description: '',
                    field_type: '1',
                    answer_type: 'SELECT',
                    suggested_answers: [
                        { id: 0, value: 'Secure Treatment', isChecked: false },
                        { id: 1, value: 'Mental Health Treatment', isChecked: false }
                    ],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'yes',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 4,
                    question: 'End Date',
                    description: '',
                    field_type: '1',
                    answer_type: 'DATE',
                    suggested_answers: [],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'yes',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 5,
                    question: 'Remained Out of Care',
                    description: '',
                    field_type: '1',
                    answer_type: 'SELECT',
                    suggested_answers: [{ id: 0, value: '', isChecked: false }],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'no',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 6,
                    question: 'Reason for Rejection',
                    description: '',
                    field_type: '1',
                    answer_type: 'SELECT',
                    suggested_answers: [{ id: 0, value: '', isChecked: false }],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'no',
                    required: 'yes',
                    flag: '0'
                }
            ]
        };
        let countyDemographics = {
            section: 'Demographics',
            section_id: 0,
            related: 'false',
            questions: [
                {
                    question_id: 0,
                    question: 'Identification Number',
                    description: '',
                    field_type: '1',
                    answer_type: 'TEXT',
                    suggested_answers: [],
                    suggested_jump: [],
                    validation1: 'Contains',
                    validation2: 'Both',
                    error_msg: 'Invalid Identification Number format. It should contain minimum 9 characters and alphanumeric with some special characters (_@./-)',
                    re_type: 'no',
                    is_to_be_mask: 'no',
                    related: 'no',
                    required: 'yes',
                    flag: '0'
                },
                {
                    question_id: 1,
                    question: 'Date of Birth',
                    description: '',
                    field_type: '1',
                    answer_type: 'DATE',
                    suggested_answers: [],
                    suggested_jump: [],
                    validation1: '',
                    validation2: '',
                    error_msg: '',
                    re_type: '',
                    is_to_be_mask: '',
                    related: 'no',
                    required: 'yes',
                    flag: '0'
                }
            ]
        };
        window.addEventListener('scroll', this.handleScroll);
        let { id } = this.props.match.params;
        const org_type = this.props.organizationsList.find((org) => org.id === Number(id)).org_type;
        let logopath = this.props.organizationsList.find((org) => org.id === Number(id)).logo_path;
        let headerColor = this.props.organizationsList.find((org) => org.id === Number(id)).header_color;
        let response = await fetchConfigureQuestions(id);

        // 1. When organization have not sections.
        if (!Array.isArray(response.response)) {
            if (org_type && org_type === 2) {
                this.setState((prevState) => ({
                    ...prevState,
                    sections: [countyDemographics, lastSection]
                }));
            } else {
                this.setState((prevState) => ({
                    ...prevState,
                    sections: [...prevState.sections, lastSection]
                }));
            }
        } else {
            // 2. When organization have sections.
            let isOutcomes = response.response.some((section) => (section.section === 'Outcomes' ? true : false));
            !isOutcomes && response.response.push(lastSection);

            let sectionResponse = Array.isArray(response.response) && response.response.find((section) => section.section === 'Outcomes');
            let index = Array.isArray(response.response) && response.response.findIndex((section) => section.section === 'Outcomes');

            if (sectionResponse) {
                if (index >= 0) {
                    response.response.splice(index, 1);
                    response.response.push(sectionResponse);
                }
            }
        }
        let sections = [...response.response];
        const section_mapped = (suggested_answers, suggested_jump) => {
            let arrIndex = [];
            let newSuggestedJumps = [];

            suggested_jump.filter((o1) => {
                return suggested_answers.some((o2) => {
                    if (o1?.answer === o2.value) {
                        let index = suggested_answers.indexOf(o2);
                        return arrIndex.push(index);
                    }
                });
            });
            suggested_answers.forEach(() => {
                if (arrIndex.length > 0) {
                    newSuggestedJumps.push(null);
                }
            });
            suggested_jump.forEach((obj, i) => {
                arrIndex.forEach((a, j) => {
                    if (i === j) {
                        return newSuggestedJumps.splice(a, 1, obj);
                    }
                });
            });
            return newSuggestedJumps;
        };

        sections = sections.map((sec) => {
            return {
                ...sec,
                questions: sec.questions.map((ques) => {
                    return {
                        ...ques,
                        suggested_jump: section_mapped(ques.suggested_answers, ques.suggested_jump),
                        suggested_answers: ques.question === 'Referral Status' ? ques.suggested_answers.map((ans) => (ans.value === 'Pending' ? { ...ans, isChecked: true } : ans)) : ques.suggested_answers
                    };
                })
            };
        });
        if (response.message !== 'sections not available') {
            this.setState({
                Org_id: id,
                org_type: org_type,
                sections: Array.isArray(response.response) ? sections : this.state.sections,
                readOnly: response.is_prediction_available,
                logoPath: logopath,
                header_color: headerColor
            });
        } else {
            this.setState({
                Org_id: id,
                org_type: org_type,
                logoPath: logopath,
                header_color: headerColor
            });
        }
    };
    handleMove = async (e) => {
        e.preventDefault();
        const { srcI, desI, list } = this.state;
        if (desI) {
            // const src = list[srcI].id;
            // const des = list[desI].id;
            list.splice(desI, 0, list.splice(srcI, 1)[0]);
            await this.saveList(list);
            //    const response = await alterQuestions(src, des)
        }
        this.setState({
            showPOPUP: false,
            btnAction: ''
        });
    };
    getList() {
        return (localStorage.getItem('theList') && JSON.parse(localStorage.getItem('theList'))) || this.list;
    }
    saveList = (list) => {
        localStorage.setItem('theList', JSON.stringify(list));
    };
    handleDelete = (idx) => (e) => {
        const index = e.target.dataset.id;
        const secid = e.target.dataset.secid;
        let sections = [...this.state.sections];
        sections[secid].questions[idx].suggested_answers = sections[secid].questions[idx].suggested_answers.filter((item, i) => Number(index) !== i);
        sections[secid].questions[idx].suggested_jump = sections[secid].questions[idx].suggested_jump.filter((item, i) => Number(index) !== i);
        // const sectionss = this.state.sections[secid].questions[idx].suggested_answers.filter((item, i) => index != i)
        sections[secid].questions[idx].suggested_answers = sections[secid].questions[idx].suggested_answers.map((item, id) => {
            return {
                id: id,
                value: item.value,
                isChecked: item.isChecked
            };
        });
        this.setState({
            sections
        });
    };

    alterID = (id) => {
        let sections = [...this.state.sections];
        sections[id].questions = sections[id].questions.map((item, id) => {
            return {
                question_id: id,
                question: item.question,
                description: item.description,
                field_type: item.field_type,
                answer_type: item.answer_type,
                suggested_answers: item.suggested_answers,
                suggested_jump: item.suggested_jump,
                validation1: item.validation1,
                validation2: item.validation2,
                error_msg: item.error_msg,
                re_type: item.re_type,
                is_to_be_mask: item.is_to_be_mask,
                related: item.related,
                required: item.required,
                flag: item.flag
            };
        });
        this.setState({ sections });
    };

    quesDelete = (i) => (e) => {
        e.preventDefault();
        const idi = e.target.dataset.id;
        let sections = [...this.state.sections];
        sections[idi].questions = [...sections[idi].questions.slice(0, i), ...sections[idi].questions.slice(i + 1)];
        let id = sections[idi].questions.length;
        this.alterID(idi);
        this.setState({
            //sections,
            lastItemId: id
        });
    };

    sectionDelete = (i) => (e) => {
        e.preventDefault();
        let sections = [...this.state.sections];
        sections = [...sections.slice(0, i), ...sections.slice(i + 1)];
        let id = this.state.lastSectionId;
        this.setState({
            sections,
            lastSectionId: id
            //lastSectionId: id - 1,
        });
    };

    addAnswer = (i) => (e) => {
        e.preventDefault();
        let secid = e.target.dataset.secid;
        let sections = [...this.state.sections];
        sections[secid].questions[i].suggested_answers = this.state.sections[secid].questions[i].suggested_answers.concat(['']);
        this.setState({ sections });
    };

    handleChange = (e) => {
        let secid = e.target.dataset.secid;
        let secname = e.target.dataset.secname;
        let id = e.target.dataset.id;
        if (['question', 'suggested_answers', 'suggested_jump', 'description', 'validation1', 'validation2', 'answer_type', 're_type', 'is_to_be_mask', 'error_msg', 'required', 'related', 'flag', 'field_type'].includes(e.target.dataset.name)) {
            if (e.target.dataset.name === 'suggested_answers' || e.target.dataset.name === 'suggested_jump') {
                let sections = [...this.state.sections];
                if (e.target.dataset.name === 'suggested_jump') {
                    sections[secid].questions[e.target.dataset.id].suggested_jump[e.target.dataset.idy] = {
                        answer: sections[secid].questions[e.target.dataset.id].suggested_answers[e.target.dataset.idy].value,
                        jumpto: e.target.value
                    };
                } else {
                    sections[secid].questions[e.target.dataset.id].suggested_answers[e.target.dataset.idy] = {
                        id: parseInt(e.target.dataset.idy),
                        value: e.target.value,
                        isChecked: false
                    };
                }

                this.setState({ sections });
            } else {
                let sections = [...this.state.sections];

                if (e.target.dataset.name === 'answer_type') {
                    sections[secid].questions[e.target.dataset.id][e.target.dataset.name] = e.target.value;
                    sections[secid].questions[e.target.dataset.id]['re_type'] = e.target.value == 'TEXT' ? 'no' : '';
                    sections[secid].questions[e.target.dataset.id]['is_to_be_mask'] = ['TEXT', 'NUMBER'].includes(e.target.value) ? 'no' : '';
                    sections[secid].questions[e.target.dataset.id].suggested_answers = sections[secid].questions[e.target.dataset.id].suggested_answers.length === 0 ? [''] : sections[secid].questions[e.target.dataset.id].suggested_answers;

                    this.setState({ sections });
                } else {
                    if (e.target.dataset.name === 'question') {
                        if (e.target.value.includes('.')) {
                            this.setState({
                                hasError: true,
                                err_msg: `Section ${parseInt(secid) + 1} :- Question ${parseInt(e.target.dataset.id) + 1} : ${e.target.value} should not contains special characters`
                            });
                        } else {
                            sections[secid].questions[e.target.dataset.id][e.target.dataset.name] = e.target.value;
                            this.setState({ sections, hasError: false, err_msg: [] });
                        }
                    }
                    sections[secid].questions[e.target.dataset.id][e.target.dataset.name] = e.target.value;

                    this.setState({ sections });
                    if (e.target.name === `related-${id}`) {
                        let sections = [...this.state.sections];

                        if (e.target.value === 'no') {
                            sections = sections.map((sec) => {
                                return {
                                    ...sec,
                                    questions: sec.questions.map((ques) => {
                                        return {
                                            ...ques,
                                            suggested_jump:
                                                Array.isArray(ques.suggested_jump) && ques.suggested_jump.length > 0
                                                    ? ques.suggested_jump.map((s, i) => {
                                                          return {
                                                              ...s,
                                                              question_jumpto: Array.isArray(s?.question_jumpto) && s?.question_jumpto.length > 0 ? s?.question_jumpto.filter((j) => j !== Number(secname)) : []
                                                          };
                                                      })
                                                    : []
                                        };
                                    })
                                };
                            });
                            this.setState({ sections });
                        }
                    }
                }
            }
        } else {
            let sections = [...this.state.sections];
            const { name, value } = e.target;
            if (name === 'related') {
                let val = this.state.sections[secid].related;
                const val1 = value === val ? (value === 'true' ? 'false' : 'true') : 'false';
                sections[secid][name] = val1;
                if (val1 === 'false') {
                    sections = sections.map((sec) => {
                        return {
                            ...sec,
                            questions: sec.questions.map((ques) => {
                                return {
                                    ...ques,
                                    suggested_jump:
                                        Array.isArray(ques.suggested_jump) && ques.suggested_jump.length > 0
                                            ? ques.suggested_jump.map((s, i) => {
                                                  return {
                                                      ...s,
                                                      jumpto: Array.isArray(s?.jumpto) && s?.jumpto.length > 0 ? s?.jumpto.filter((j) => j !== Number(secname)) : []
                                                  };
                                              })
                                            : []
                                };
                            })
                        };
                    });
                    this.setState({ sections });
                }
            } else {
                sections[secid][name] = value;
            }

            this.setState({
                sections
            });
        }
    };

    newItemId = () => {
        const id = this.state.lastItemId;
        //this.state.lastItemId += 1;
        this.setState((prevState) => ({
            ...prevState,
            lastItemId: prevState.lastItemId + 1
        }));
        return id;
    };

    newSectionId = () => {
        const id = this.state.lastSectionId;
        //this.state.lastSectionId += 1;
        this.setState((prevState) => ({
            ...prevState,
            lastSectionId: prevState.lastSectionId + 1
        }));
        return id;
    };

    addQuestion = (e) => {
        const secid = e.target.dataset.id;
        const quesid = Number(e.target.dataset.idx);
        this.setState({
            lastItemId: quesid
        });
        const id = this.newItemId();

        let ques = {
            question_id: quesid + 1,
            question: '',
            description: '',
            field_type: '1',
            answer_type: '',
            suggested_answers: [''],
            suggested_jump: [],
            validation1: '',
            validation2: '',
            error_msg: '',
            re_type: '',
            is_to_be_mask: '',
            related: 'no',
            required: 'yes',
            flag: '0'
        };
        let sections = [...this.state.sections];
        sections[secid].questions = [...sections[secid].questions, ques];
        let { readOnly } = this.state;

        if (readOnly) {
            this.setState({
                [`Ques-${quesid + 1}`]: true
            });
        }
        this.setState({ sections });
    };

    addSection = () => {
        const id = this.newSectionId();
        this.setState((prevState) => ({
            sections: [
                ...prevState.sections,
                {
                    section: '',
                    section_id: id + 1,
                    related: 'false',
                    questions: [
                        {
                            question_id: 0,
                            question: '',
                            description: '',
                            field_type: '1',
                            answer_type: '',
                            suggested_answers: [''],
                            suggested_jump: [],
                            validation1: '',
                            validation2: '',
                            error_msg: '',
                            re_type: '',
                            is_to_be_mask: '',
                            related: 'no',
                            required: 'yes',
                            flag: '0'
                        }
                    ]
                }
            ],
            lastItemId: 1
        }));
    };

    onPreviuos = () => {
        let id = this.state.lastSectionId;
        this.setState({
            lastSectionId: id - 1
        });
    };

    onNext = () => {
        let id = this.state.lastSectionId;
        this.setState({
            lastSectionId: id + 1
        });
    };
    onLast = () => {
        let id = this.state.sections.length - 1;
        let sections = [...this.state.sections];
        sections.map((section, i) => (section.section_id = i));
        this.setState({
            sections,
            lastSectionId: id
        });
    };
    handlePreview = async (e) => {
        e.preventDefault();
        this.setState({
            isPreview: true,
            isOpen: true
        });
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        let sections = [...this.state.sections];
        let relatedSections = [...this.state.relatedSections];
        let relatedQuestions = [...this.state.relatedQuestions];

        //Find : Related Sections
        sections.forEach((section, id) => {
            let length = 0;
            section.related === 'true' &&
                sections.forEach((section1, idx) => {
                    section1.questions.forEach((question, idy) => {
                        question.suggested_jump &&
                            question.suggested_jump.forEach((suggestjump, idz) => {
                                suggestjump != null &&
                                    suggestjump.jumpto &&
                                    suggestjump.jumpto.forEach((jmpto, idz1) => {
                                        jmpto === sections[id].section && length++;
                                    });
                            });
                    });
                });
            if (length === 0) {
                section.related === 'true' && relatedSections.push({ section: section.section, id: id + 1 });
            }
        });
        for (var a in relatedSections) {
            relatedSections.length > 0 &&
                toast.warning('Section ' + relatedSections[a].id + ': *' + relatedSections[a].section.toUpperCase() + '* is Related but not used in any other jump while configuration', {
                    position: toast.POSITION.TOP_CENTER
                });
        }
        //Find : Related Question 1
        var newQues = [];
        let validatedQuestions = [];
        sections.forEach((section, id) => {
            section.questions.filter((ques, id1) => {
                ques.related === 'yes' && newQues.push({ sectionid: id, quesid: id1 });
                ques.answer_type === 'NUMBER' && (ques.validation1 === '' || ques.validation2 === '' || ques.error_msg === '') && validatedQuestions.push({ id: id, idx: id1 });
            });
        });
        newQues &&
            newQues.forEach((section) => {
                let id = section.sectionid;
                let id1 = section.quesid;
                let reqArray = [];
                sections[id].questions.forEach((question, idy) => {
                    question.suggested_jump &&
                        question.suggested_jump.map((suggestedjump) => {
                            return (
                                suggestedjump != null &&
                                suggestedjump.question_jumpto &&
                                suggestedjump.question_jumpto.map((questionjumpto) => {
                                    return questionjumpto === sections[id].questions[id1].question && reqArray.push(questionjumpto);
                                })
                            );
                        });
                });
                reqArray.length === 0 && relatedQuestions.push(section);
                reqArray.length > 0 && relatedQuestions.slice(reqArray.indexOf(section));
                //reqArray.length == 0 ? alertSections1.push(section) : alertSections1.slice(reqArray.indexOf(section))
            });
        //Find : Related Question 2
        for (var b in relatedQuestions) {
            let id = relatedQuestions[b].sectionid + 1;
            let id1 = relatedQuestions[b].quesid + 1;
            relatedQuestions.length > 0 &&
                toast.warning('Section ' + id + ': Question ' + id1 + ' **' + sections[id - 1].questions[id1 - 1].question.toUpperCase() + '** is Related but not used in any other question jump while configuration', {
                    position: toast.POSITION.TOP_CENTER
                });
        }
        //Validate : Questions answer type Number
        for (var c in validatedQuestions) {
            let id = validatedQuestions[c].id + 1;
            let idx = validatedQuestions[c].idx + 1;
            validatedQuestions.length > 0 && toast.error('Section ' + id + ': Question ' + idx + ' **' + sections[id - 1].questions[idx - 1].question.toUpperCase() + '** Answer should be validated properly', { position: toast.POSITION.TOP_CENTER });
        }

        //FIND : Outcomes Section
        let lastSectionValue = this.state.sections.find((section) => section.section === 'Outcomes');
        const findIndex = this.state.sections.findIndex((section) => section.section === 'Outcomes');
        if (findIndex >= 0) {
            let sections = [...this.state.sections];
            sections.splice(findIndex, 1);
            this.setState({ sections });
            this.setState((prevState) => ({
                ...prevState,
                sections: [...prevState.sections, lastSectionValue]
            }));
        }
        //Making : Suggestions Jump values proper
        sections = [...this.state.sections];
        sections = sections.map((sec) => {
            return {
                ...sec,
                questions: sec.questions.map((ques) => {
                    return {
                        ...ques,
                        suggested_jump: Array.isArray(ques.suggested_jump) && ques.suggested_jump.length > 0 ? ques.suggested_jump.map((s, i) => (s?.jumpto?.length > 0 || s?.question_jumpto?.length > 0) && s).filter((item) => item !== false) : []
                    };
                })
            };
        });

        let data = {
            customer: this.state.Org_id,
            sections: sections
        };

        if (!this.state.hasError && relatedSections.length === 0 && relatedQuestions.length === 0 && validatedQuestions.length === 0) {
            this.setState({ isLoading: true });
            const response = await saveClientConfigure(data);
            if (response?.status === 'success') {
                this.setState({ isLoading: false });
                toast.info(`Questions configured successfully. `, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                });
            } else {
                this.setState({ isLoading: false });
                toast.error(response?.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                });
            }
        } else {
            relatedSections.length > 0 || relatedQuestions.length > 0
                ? toast.error('The Data was not Submitted Due to improper usage of Related Sections or due to Related Questions ', {
                      position: 'top-center',
                      autoClose: 5000
                  })
                : toast.error(this.state.err_msg, {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 3000
                  });
        }
    };

    handleClose = () => {
        this.setState({
            isOpen: false,
            isPreview: false
        });
    };
    jumpOptions = () => {
        let options = [];
        this.state.sections.filter((sec, key) => sec.related === 'true').map((q, i) => options.push({ value: q.section, label: q.section, id: i }));
        return options;
    };
    Question_jumpOptions = (id) => {
        let options = [];
        this.state.sections[id].questions.filter((sec, key) => sec.related === 'yes').map((q, i) => options.push({ value: q.question, label: q.question, id: i }));
        return options;
    };

    multihandleChange = (id, idx, idy) => (e) => {
        let sections = [...this.state.sections];
        let jumpValues = Array.isArray(e) ? e.map((arr) => arr.value) : [];
        sections[id].questions[idx].suggested_jump[idy] =
            jumpValues.length === 0
                ? {
                      ...sections[id].questions[idx].suggested_jump[idy],
                      jumpto: []
                  }
                : {
                      answer: sections[id].questions[idx].suggested_answers[idy].value,
                      jumpto: jumpValues,
                      question_jumpto: sections[id].questions[idx].suggested_jump[idy] ? sections[id].questions[idx].suggested_jump[idy].question_jumpto : []
                  };
        this.setState({
            sections
        });
    };
    Question_multihandleChange = (id, idx, idy) => (e) => {
        let sections = [...this.state.sections];
        let jumpValues = Array.isArray(e) ? e.map((arr) => arr.value) : [];
        sections[id].questions[idx].suggested_jump[idy] =
            jumpValues.length === 0
                ? {
                      ...sections[id].questions[idx].suggested_jump[idy],
                      question_jumpto: []
                  }
                : {
                      answer: sections[id].questions[idx].suggested_answers[idy].value,
                      jumpto: sections[id].questions[idx].suggested_jump[idy] ? sections[id].questions[idx].suggested_jump[idy].jumpto : [],
                      question_jumpto: jumpValues
                  };
        this.setState({
            sections
        });
    };

    render() {
        toast.configure();
        let { sections, isPreview, logoPath, header_color, isLoading } = this.state;
        let id = this.state.lastSectionId;
        const sectionLength = this.state.sections.length - 1;
        let jumpOpt = [];
        this.state.sections && this.state.sections.filter((sec, key) => sec.related === 'true').map((q, i) => jumpOpt.push({ value: q.section, label: q.section, id: i }));
        const OutcomesStaticQues = ['Client Code', 'Identification Number', 'Date of Birth', 'Referral Status', 'Program', 'Start Date', 'Program Completion', 'End Date', 'Remained Out of Care'];
        const NonEditSection = ['Demographics', 'Outcomes'];
        const findIndex = this.state.sections.findIndex((section) => section.section === 'Outcomes');
        //Removing Duplicate values
        const StaticQuesIndex = [];
        OutcomesStaticQues.filter((ques1, i) => this.state.sections.length > 1 && this.state.sections[id].questions?.some((ques2, j) => ques1 === ques2.question && StaticQuesIndex.push(ques2.question_id)));

        if (isPreview) {
            return (
                <Modal isOpen={this.state.isOpen} ariaHideApp={false} onRequestClose={this.handleClose} style={customStyles} scrollable="true" contentLabel="Example Modal">
                    <Preview DynamicQuestions={this.state.sections} logoPath={logoPath} headerColor={header_color} />
                </Modal>
            );
        } else if (isLoading) {
            return (
                <div className="container">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                        <span className="font-weight-bold h5">Loading</span>
                        <BeatLoader size={24} color="#0099CC" loading={isLoading} />
                        <BeatLoader size={24} color="#0099CC" loading={isLoading} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container-fluid mb-5">
                    {this.state.sections.length > 0 ? (
                        <div style={{ border: '1px solid #007bff' }}>
                            <form onChange={this.handleChange} className="m-3">
                                <div className="form-group row">
                                    <label className="col-sm-1 col-form-label font-weight-bold " htmlFor="question">
                                        Section {id + 1}:
                                    </label>
                                    <div className="col-sm-5">
                                        <input className="form-control" type="text" name="section" id="section" data-secid={id} value={sections[id].section} readOnly={NonEditSection.includes(sections[id].section) ? true : false} />
                                    </div>
                                    {id === 0 || id === findIndex ? (
                                        ''
                                    ) : (
                                        <React.Fragment>
                                            <div className="form-check form-check-inline col-sm-1 ml-3">
                                                <input type="checkbox" className="form-check-input" name="related" data-secid={id} data-secname={this.state.sections[id] && this.state.sections[id].section} checked={this.state.sections[id].related === 'true'} value="false" />
                                                <label className="form-check-label font-weight-bold">Related</label>
                                            </div>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    top: '-5px',
                                                    right: '-0px',
                                                    width: '50px',
                                                    height: '44px'
                                                }}
                                                className="ml-3"
                                                data-id={id}
                                                onClick={this.sectionDelete(id)}
                                            >
                                                <Link data-id={id} className="btn btn-danger" to="#">
                                                    <i data-id={id} className="fa fa-trash-o fa-lg"></i>
                                                </Link>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                                <DragDropContext
                                    onDragEnd={async (param, props) => {
                                        const srcI = param.source.index;
                                        const desI = param.destination?.index;
                                        if (desI || desI === 0) {
                                            sections[id].questions.splice(desI, 0, sections[id].questions.splice(srcI, 1)[0]);
                                            await this.saveList(sections[id].questions);
                                            this.alterID(id);
                                        }
                                    }}
                                >
                                    <Droppable droppableId="droppable-1">
                                        {(provided, _) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {sections[id].questions.map((val, idx) => {
                                                    let catId = `cat-${idx}`,
                                                        answerId = `answer-${idx}`,
                                                        descId = `description-${idx}`,
                                                        validationId1 = `validation1-${idx}`,
                                                        validationId2 = `validation2-${idx}`,
                                                        typeId = `type-${idx}`,
                                                        errorId = `error-${idx}`,
                                                        re_typeId = `re_type-${idx}`,
                                                        is_to_be_maskID = `is_to_be_mask-${idx}`,
                                                        relatedId = `related-${idx}`,
                                                        requiredId = `required-${idx}`,
                                                        flagId = `flag-${idx}`,
                                                        fieldTypeId = `fieldType-${idx}`;

                                                    return (
                                                        <div className="mb-2" key={val.question_id}>
                                                            <Draggable key={val.question_id} draggableId={'draggable-' + val.question_id} index={idx}>
                                                                {(provided, snapshot) => (
                                                                    <>
                                                                        {' '}
                                                                        <div
                                                                            className="list-group-item col-10  mt-1 "
                                                                            {...provided.dragHandleProps}
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            style={{
                                                                                ...provided.draggableProps.style,
                                                                                boxShadow: snapshot.isDragging ? '0 0 .4rem #666' : 'none'
                                                                            }}
                                                                        >
                                                                            <div className="m-3 p-3">
                                                                                <div className="form-group row">
                                                                                    <label className="col-sm-2 col-form-label font-weight-bold " htmlFor={catId}>{`Question #${idx + 1}:`}</label>
                                                                                    <div className="col-sm-6">
                                                                                        <input type="text" name={catId} data-id={idx} data-secid={id} data-name="question" id={catId} required readOnly={this.state.readOnly === true ? (this.state[`Ques-${idx}`] ? false : true) : (id === 0 && StaticQuesIndex.includes(val.question_id) ? true : false) || (id === this.state.sections.length - 1 && StaticQuesIndex.includes(val.question_id) ? true : false)} value={sections[id].questions[idx].question} className="form-control" />
                                                                                    </div>
                                                                                    {!this.state.readOnly || this.state[`Ques-${idx}`] ? (
                                                                                        id === 0 ? (
                                                                                            idx === 0 || idx === 1 || idx === 2 || StaticQuesIndex.includes(val.question_id) ? (
                                                                                                ''
                                                                                            ) : (
                                                                                                <div
                                                                                                    style={{
                                                                                                        position: 'relative',
                                                                                                        top: '1px',
                                                                                                        right: '-20px',
                                                                                                        width: '50px',
                                                                                                        height: '25px'
                                                                                                    }}
                                                                                                    className=""
                                                                                                    data-id={id}
                                                                                                    onClick={this.quesDelete(idx)}
                                                                                                >
                                                                                                    <Link data-id={id} className="btn btn-danger" to="#">
                                                                                                        <i data-id={id} className="fa fa-trash-o fa-lg"></i>{' '}
                                                                                                    </Link>
                                                                                                </div>
                                                                                            )
                                                                                        ) : id === findIndex ? (
                                                                                            StaticQuesIndex.includes(val.question_id) ? (
                                                                                                ''
                                                                                            ) : (
                                                                                                <div
                                                                                                    style={{
                                                                                                        position: 'relative',
                                                                                                        top: '1px',
                                                                                                        right: '-20px',
                                                                                                        width: '50px',
                                                                                                        height: '25px'
                                                                                                    }}
                                                                                                    className=""
                                                                                                    data-id={id}
                                                                                                    onClick={this.quesDelete(idx)}
                                                                                                >
                                                                                                    <Link data-id={id} className="btn btn-danger" to="#">
                                                                                                        <i data-id={id} className="fa fa-trash-o fa-lg"></i>{' '}
                                                                                                    </Link>
                                                                                                </div>
                                                                                            )
                                                                                        ) : (
                                                                                            <div
                                                                                                style={{
                                                                                                    position: 'relative',
                                                                                                    top: '1px',
                                                                                                    right: '-20px',
                                                                                                    width: '50px',
                                                                                                    height: '25px'
                                                                                                }}
                                                                                                className=""
                                                                                                data-id={id}
                                                                                                onClick={this.quesDelete(idx)}
                                                                                            >
                                                                                                <Link data-id={id} className="btn btn-danger" to="#">
                                                                                                    <i data-id={id} className="fa fa-trash-o fa-lg"></i>{' '}
                                                                                                </Link>
                                                                                            </div>
                                                                                        )
                                                                                    ) : (
                                                                                        ''
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-group row" key={idx}>
                                                                                    <label className="col-sm-2 col-form-label font-weight-bold " htmlFor={descId}>
                                                                                        Description:
                                                                                    </label>
                                                                                    <div className="col-sm-6">
                                                                                        <input type="text" name={descId} data-id={idx} data-secid={id} data-name="description" id={descId} value={sections[id].questions[idx].description} className="form-control" />
                                                                                    </div>
                                                                                </div>

                                                                                {sections[id].questions[idx].question === 'Client Code' && (
                                                                                    <fieldset className="form-group">
                                                                                        <div className="row">
                                                                                            <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={fieldTypeId}>
                                                                                                Field Type:
                                                                                            </legend>
                                                                                            <div className="col-sm-10">
                                                                                                <div className="form-check form-check-inline">
                                                                                                    <input type="radio" name={fieldTypeId} className="form-check-input" data-id={idx} data-secid={id} data-name="field_type" id={fieldTypeId} checked={sections[id].questions[idx].field_type?.toString() === '0'} value="0" />
                                                                                                    <label className="form-check-label">Auto</label>
                                                                                                </div>
                                                                                                <div className="form-check form-check-inline">
                                                                                                    <input type="radio" name={fieldTypeId} className="form-check-input" data-id={idx} data-secid={id} data-name="field_type" id={fieldTypeId} checked={sections[id].questions[idx].field_type?.toString() === '1'} value="1" />
                                                                                                    <label className="form-check-label">Manual</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </fieldset>
                                                                                )}

                                                                                {((Object.keys(sections[id].questions[idx]).includes('field_type') && sections[id].questions[idx].field_type?.toString() !== '0') || !Object.keys(sections[id].questions[idx]).includes('field_type')) && (
                                                                                    <React.Fragment>
                                                                                        <fieldset className="form-group">
                                                                                            <div className="row">
                                                                                                <React.Fragment>
                                                                                                    <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={typeId}>
                                                                                                        Answer Type:
                                                                                                    </legend>
                                                                                                    <div className="col-sm-8">
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input
                                                                                                                className="form-check-input"
                                                                                                                name={typeId}
                                                                                                                data-id={idx}
                                                                                                                data-secid={id}
                                                                                                                data-name="answer_type"
                                                                                                                id={typeId}
                                                                                                                type="radio"
                                                                                                                disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false}
                                                                                                                checked={sections[id].questions[idx].answer_type === 'SELECT'}
                                                                                                                //disabled={this.state.answer_type !== "SELECT" ? true : false}
                                                                                                                value="SELECT"
                                                                                                                required
                                                                                                            />
                                                                                                            <label className="form-check-label">Drop Down</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="TEXT" disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false} checked={sections[id].questions[idx].answer_type === 'TEXT'} required />
                                                                                                            <label className="form-check-label">Text</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="NUMBER" disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false} checked={sections[id].questions[idx].answer_type === 'NUMBER'} required />
                                                                                                            <label className="form-check-label">Number</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="CHECKBOX" disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false} checked={sections[id].questions[idx].answer_type === 'CHECKBOX'} required />
                                                                                                            <label className="form-check-label">Checkbox</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="RADIO" checked={sections[id].questions[idx].answer_type === 'RADIO'} required />
                                                                                                            <label className="form-check-label">Radio</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="FILE" disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false} checked={sections[id].questions[idx].answer_type === 'FILE'} required />
                                                                                                            <label className="form-check-label">Upload File</label>
                                                                                                        </div>
                                                                                                        <div className="form-check form-check-inline">
                                                                                                            <input className="form-check-input" name={typeId} data-id={idx} data-secid={id} data-name="answer_type" id={typeId} type="radio" value="DATE" disabled={sections[id].questions[idx].question === 'Referral Status' ? true : false} checked={sections[id].questions[idx].answer_type === 'DATE'} required />
                                                                                                            <label className="form-check-label">Date</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </React.Fragment>
                                                                                            </div>
                                                                                        </fieldset>
                                                                                        {this.state.sections[id].questions[idx].answer_type === '' || this.state.sections[id].questions[idx].answer_type === 'TEXT' || this.state.sections[id].questions[idx].answer_type === 'NUMBER' || this.state.sections[id].questions[idx].answer_type === 'RELATED' || this.state.sections[id].questions[idx].answer_type === 'DATE' || this.state.sections[id].questions[idx].answer_type === 'FILE'
                                                                                            ? ''
                                                                                            : this.state.sections[id].questions
                                                                                                  .filter((p) => p.question_id === this.state.sections[id].questions[idx].question_id)
                                                                                                  .map((q, i) =>
                                                                                                      q.suggested_answers.map((question, idy) => (
                                                                                                          <div className="form-group row">
                                                                                                              <label className="col-sm-1 col-form-label font-weight-bold">Answer {idy + 1}:</label>
                                                                                                              <div className="col-sm-3">
                                                                                                                  <input type="text" name={answerId} data-id={idx} data-secid={id} data-name="suggested_answers" id={answerId} data-idy={idy} value={question.value ? question.value : ''} className="form-control" required />
                                                                                                                  {idy !== 0 && (
                                                                                                                      <div
                                                                                                                          style={{
                                                                                                                              position: 'absolute',
                                                                                                                              top: '1px',
                                                                                                                              right: '-0px',
                                                                                                                              width: '25px',
                                                                                                                              height: '25px',
                                                                                                                              fontSize: '24px',
                                                                                                                              color: 'red'
                                                                                                                          }}
                                                                                                                          className="font-text-bold text-center "
                                                                                                                          data-secid={id}
                                                                                                                          data-id={idy}
                                                                                                                          onClick={this.handleDelete(idx, idy)}
                                                                                                                      >
                                                                                                                          <i className="fa fa-remove" data-secid={id} data-id={idy}></i>
                                                                                                                      </div>
                                                                                                                  )}
                                                                                                                  {idy === this.state.sections[id].questions[idx].suggested_answers.length - 1 && (
                                                                                                                      <div
                                                                                                                          style={{
                                                                                                                              position: 'absolute',
                                                                                                                              top: '1px',
                                                                                                                              right: '-25px',
                                                                                                                              width: '25px',
                                                                                                                              height: '25px',
                                                                                                                              fontSize: '24px'
                                                                                                                          }}
                                                                                                                          className="font-text-bold text-center "
                                                                                                                          data-secid={id}
                                                                                                                          data-id={idy}
                                                                                                                          onClick={this.addAnswer(idx)}
                                                                                                                      >
                                                                                                                          <i
                                                                                                                              className="fa fa-plus"
                                                                                                                              style={{
                                                                                                                                  fontSize: '28px'
                                                                                                                              }}
                                                                                                                              data-secid={id}
                                                                                                                              data-id={idy}
                                                                                                                          ></i>
                                                                                                                      </div>
                                                                                                                  )}
                                                                                                              </div>
                                                                                                              {this.state.sections[id].questions[idx].answer_type === 'CHECKBOX' ? (
                                                                                                                  ''
                                                                                                              ) : (
                                                                                                                  <>
                                                                                                                      <label className="col-sm-1 col-form-label font-weight-bold ml-3">Jump to:</label>
                                                                                                                      <div className="col-sm-3">
                                                                                                                          <Select key={id} value={jumpOpt.filter((value) => this.state.sections[id].questions[idx].suggested_jump[idy] && Array.isArray(this.state.sections[id].questions[idx].suggested_jump[idy].jumpto) && this.state.sections[id].questions[idx].suggested_jump[idy].jumpto.includes(value.value))} isClearable styles={colourStyles} isMulti name="suggested_jump" components={animatedComponents} options={jumpOpt} className="basic-multi-select" placeholder="Select Sections jump" onChange={this.multihandleChange(id, idx, idy)} />

                                                                                                                          {/* <select name="jumpto"
                                                                                                                            className="form-control" id="exampleFormControlSelect1"
                                                                                                                            multiple
                                                                                                                            data-id={idx}
                                                                                                                            data-secid={id}
                                                                                                                            data-name="suggested_jump"
                                                                                                                            id={answerId}
                                                                                                                            data-idy={idy} required>
                                                                                                                            <option value="" >Select</option>
                                                                                                                            {this.state.sections.filter((sec, key) => sec.related === "true").map(
                                                                                                                                (q, i) =>
                                                                                                                                    <option key={i} value={q.section}
                                                                                                                                        selected={q.section === `${this.state.sections[id].questions[idx].suggested_jump[idy] && this.state.sections[id].questions[idx].suggested_jump[idy].jumpto}`}
                                                                                                                                    >
                                                                                                                                        {q.section}
                                                                                                                                    </option>
                                                                                                                            )}
                                                                                                                        </select> */}
                                                                                                                      </div>

                                                                                                                      <div className="col-sm-3">
                                                                                                                          <Select value={this.Question_jumpOptions(id).filter((value) => this.state.sections[id].questions[idx].suggested_jump[idy] && Array.isArray(this.state.sections[id].questions[idx].suggested_jump[idy].question_jumpto) && this.state.sections[id].questions[idx].suggested_jump[idy].question_jumpto.includes(value.value))} isClearable styles={colourStyles} isMulti name="ques_suggested_jump" options={this.Question_jumpOptions(id)} className="basic-multi-select" placeholder="Select jump within Section" onChange={this.Question_multihandleChange(id, idx, idy)} />
                                                                                                                      </div>
                                                                                                                  </>
                                                                                                              )}
                                                                                                          </div>
                                                                                                      ))
                                                                                                  )}
                                                                                        {this.state.sections[id].questions[idx].answer_type === 'TEXT' ? (
                                                                                            <React.Fragment>
                                                                                                <div className="form-group row" key={idx}>
                                                                                                    <label className="col-sm-2 col-form-label font-weight-bold " htmlFor={validationId1}>
                                                                                                        Validation:
                                                                                                    </label>
                                                                                                    <div className="col-sm-2">
                                                                                                        <select name={validationId1} data-id={idx} data-secid={id} data-name="validation1" id={validationId1} className="form-control" onChange={this.handleChange} required>
                                                                                                            <option value="">Select</option>
                                                                                                            <option value="Contains" selected={sections[id].questions[idx].validation1 === 'Contains'}>
                                                                                                                Contains
                                                                                                            </option>
                                                                                                            <option value="Not Contains" selected={sections[id].questions[idx].validation2 === 'Not Contains'}>
                                                                                                                Does not contain
                                                                                                            </option>
                                                                                                        </select>
                                                                                                    </div>
                                                                                                    <div className="col-sm-2">
                                                                                                        <select name={validationId2} data-id={idx} data-secid={id} data-name="validation2" id={validationId1} className="form-control" onChange={this.handleChange} required>
                                                                                                            <option value="">Select</option>
                                                                                                            <option value="Numbers" selected={sections[id].questions[idx].validation2 === 'Numbers'}>
                                                                                                                Numbers
                                                                                                            </option>
                                                                                                            <option value="Special characters" selected={sections[id].questions[idx].validation2 === 'Special characters'}>
                                                                                                                Special characters
                                                                                                            </option>
                                                                                                            <option value="Both" selected={sections[id].questions[idx].validation2 === 'Both'}>
                                                                                                                Both
                                                                                                            </option>
                                                                                                        </select>
                                                                                                    </div>
                                                                                                    <div className="col-sm-2">
                                                                                                        <input type="text" name={errorId} data-id={idx} data-secid={id} data-name="error_msg" id={errorId} placeholder="Error message" value={sections[id].questions[idx].error_msg} className="form-control" />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <fieldset className="form-group">
                                                                                                    <div className="row">
                                                                                                        <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={re_typeId}>
                                                                                                            Re-Type Question:
                                                                                                        </legend>
                                                                                                        <div className="col-sm-10">
                                                                                                            <div className="form-check form-check-inline">
                                                                                                                <input type="radio" name={re_typeId} className="form-check-input" data-secid={id} data-id={idx} data-name="re_type" id={re_typeId} checked={sections[id].questions[idx].re_type === 'yes'} data-secname={sections[id] && sections[id].questions[idx].question} value="yes" />
                                                                                                                <label className="form-check-label">Yes</label>
                                                                                                            </div>
                                                                                                            <div className="form-check form-check-inline">
                                                                                                                <input type="radio" name={re_typeId} className="form-check-input" data-secid={id} data-id={idx} data-name="re_type" id={re_typeId} checked={sections[id].questions[idx].re_type === 'no'} data-secname={sections[id] && sections[id].questions[idx].question} value="no" />
                                                                                                                <label className="form-check-label">No</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </fieldset>
                                                                                            </React.Fragment>
                                                                                        ) : (
                                                                                            ''
                                                                                        )}
                                                                                        {this.state.sections[id].questions[idx].answer_type === 'NUMBER' ? (
                                                                                            <React.Fragment>
                                                                                                <div className="form-group row" key={idx}>
                                                                                                    <label className="col-sm-2 col-form-label font-weight-bold " htmlFor={validationId1}>
                                                                                                        Validation:
                                                                                                    </label>
                                                                                                    <label className="col-sm-1 col-form-label font-weight-bold ">Between</label>
                                                                                                    <div className="col-sm-1">
                                                                                                        <input type="text" name={validationId1} data-id={idx} data-secid={id} data-name="validation1" id={validationId1} placeholder="Number" value={sections[id].questions[idx].validation1} className="form-control" style={{ border: `${this.state.sections[id].questions[idx].validation1 === '' ? '2px solid #FF0000' : ''}` }} />
                                                                                                        {this.state.sections[id].questions[idx].validation1 === '' ? <span className="text-danger fs-6">Required!</span> : ''}
                                                                                                    </div>
                                                                                                    <span className="text-center"> and</span>

                                                                                                    <div className="col-sm-1">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name={validationId2}
                                                                                                            data-id={idx}
                                                                                                            data-secid={id}
                                                                                                            data-name="validation2"
                                                                                                            id={validationId2}
                                                                                                            placeholder="Number"
                                                                                                            value={sections[id].questions[idx].validation2}
                                                                                                            className="form-control"
                                                                                                            style={{
                                                                                                                border: `${this.state.sections[id].questions[idx].validation1 !== '' && this.state.sections[id].questions[idx].validation2 === '' ? '2px solid #FF0000' : ''}`
                                                                                                            }}
                                                                                                        />
                                                                                                        {this.state.sections[id].questions[idx].validation1 !== '' && this.state.sections[id].questions[idx].validation2 === '' ? <span className="text-danger fs-6">Required!</span> : ''}
                                                                                                    </div>
                                                                                                    <div className="col-sm-2">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name={errorId}
                                                                                                            data-id={idx}
                                                                                                            data-secid={id}
                                                                                                            data-name="error_msg"
                                                                                                            id={errorId}
                                                                                                            placeholder="Error message"
                                                                                                            value={sections[id].questions[idx].error_msg}
                                                                                                            className="form-control"
                                                                                                            style={{
                                                                                                                border: `${this.state.sections[id].questions[idx].validation1 !== '' && this.state.sections[id].questions[idx].error_msg === '' ? '2px solid #FF0000' : ''}`
                                                                                                            }}
                                                                                                        />
                                                                                                        {this.state.sections[id].questions[idx].validation1 !== '' && this.state.sections[id].questions[idx].error_msg === '' ? <span className="text-danger fs-6">Required!</span> : ''}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </React.Fragment>
                                                                                        ) : (
                                                                                            ''
                                                                                        )}
                                                                                        {
                                                                                            // Masking Question
                                                                                            ['TEXT', 'NUMBER'].includes(this.state.sections[id].questions[idx].answer_type) ? (
                                                                                                <Fragment>
                                                                                                    <fieldset className="form-group">
                                                                                                        <div className="row">
                                                                                                            <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={is_to_be_maskID}>
                                                                                                                Is To Be Mask?:
                                                                                                            </legend>
                                                                                                            <div className="col-sm-10">
                                                                                                                <div className="form-check form-check-inline">
                                                                                                                    <input type="radio" name={is_to_be_maskID} className="form-check-input" data-secid={id} data-id={idx} data-name="is_to_be_mask" id={is_to_be_maskID} checked={sections[id].questions[idx].is_to_be_mask === 'yes'} data-secname={sections[id] && sections[id].questions[idx].question} value="yes" />
                                                                                                                    <label className="form-check-label">Yes</label>
                                                                                                                </div>
                                                                                                                <div className="form-check form-check-inline">
                                                                                                                    <input type="radio" name={is_to_be_maskID} className="form-check-input" data-secid={id} data-id={idx} data-name="is_to_be_mask" id={is_to_be_maskID} checked={sections[id].questions[idx].is_to_be_mask === 'no'} data-secname={sections[id] && sections[id].questions[idx].question} value="no" />
                                                                                                                    <label className="form-check-label">No</label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </fieldset>
                                                                                                </Fragment>
                                                                                            ) : (
                                                                                                ''
                                                                                            )
                                                                                        }
                                                                                        <fieldset className="form-group">
                                                                                            <div className="row">
                                                                                                <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={relatedId}>
                                                                                                    Related:
                                                                                                </legend>
                                                                                                <div className="col-sm-10">
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={relatedId} className="form-check-input" data-id={idx} data-secid={id} data-name="related" id={relatedId} checked={sections[id].questions[idx].related === 'yes'} data-secname={sections[id] && sections[id].questions[idx].question} value="yes" />
                                                                                                        <label className="form-check-label">Yes</label>
                                                                                                    </div>
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={relatedId} className="form-check-input" data-id={idx} data-secid={id} data-name="related" id={relatedId} checked={sections[id].questions[idx].related === 'no'} data-secname={sections[id] && sections[id].questions[idx].question} value="no" />
                                                                                                        <label className="form-check-label">No</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </fieldset>
                                                                                        <fieldset className="form-group">
                                                                                            <div className="row">
                                                                                                <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={requiredId}>
                                                                                                    Required:
                                                                                                </legend>
                                                                                                <div className="col-sm-10">
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={requiredId} className="form-check-input" data-id={idx} data-secid={id} data-name="required" id={requiredId} checked={sections[id].questions[idx].required === 'yes'} value="yes" />
                                                                                                        <label className="form-check-label">Yes</label>
                                                                                                    </div>
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={requiredId} className="form-check-input" data-id={idx} data-secid={id} data-name="required" id={requiredId} checked={sections[id].questions[idx].required === 'no'} value="no" />
                                                                                                        <label className="form-check-label">No</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </fieldset>
                                                                                        <fieldset className="form-group">
                                                                                            <div className="row">
                                                                                                <legend className="col-form-label col-sm-2 font-weight-bold" htmlFor={requiredId}>
                                                                                                    Flag:
                                                                                                </legend>
                                                                                                <div className="col-sm-10">
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={flagId} className="form-check-input" data-id={idx} data-secid={id} data-name="flag" id={flagId} checked={sections[id].questions[idx].flag === '0'} value="0" />
                                                                                                        <label className="form-check-label">Add</label>
                                                                                                    </div>
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={flagId} className="form-check-input" data-id={idx} data-secid={id} data-name="flag" id={flagId} checked={sections[id].questions[idx].flag === '1'} value="1" />
                                                                                                        <label className="form-check-label">Edit</label>
                                                                                                    </div>
                                                                                                    <div className="form-check form-check-inline">
                                                                                                        <input type="radio" name={flagId} className="form-check-input" data-id={idx} data-secid={id} data-name="flag" id={flagId} checked={sections[id].questions[idx].flag === '2'} value="2" />
                                                                                                        <label className="form-check-label">Custom</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </fieldset>
                                                                                    </React.Fragment>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </Draggable>
                                                        </div>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <div className=" col d-flex justify-content-end">
                                    <button className="btn btn-primary" data-id={id} data-idx={this.state.sections[id].questions.length - 1} onClick={this.addQuestion}>
                                        {this.state.sections[id].questions.length === 0 ? 'Add Question' : 'Add Next Question'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    <button onClick={this.handleNavToTop} type="button" className="btn btn-primary rounded-pill mb-1" id="btn-back-to-top">
                        <BsFillArrowUpCircleFill />
                    </button>
                    <button onClick={this.handleNavToBottom} type="button" className="btn btn-primary rounded-pill" id="btn-back-to-bottom">
                        <BsFillArrowDownCircleFill />
                    </button>

                    <div className="pb-1">
                        <div className="footer row mt-3 text-center fixed-bottom bg-white p-1 pt-2">
                            {/* <div className="row mt-3 text-center"> */}
                            <div className="col col-sm-2  mb-1">
                                <button className="btn btn-primary" disabled={id === 0 ? true : sectionLength >= 1 ? false : true} onClick={this.onPreviuos}>
                                    Previous Section
                                </button>
                            </div>
                            <div className="col col-sm-2 mb-1">
                                <button className="btn btn-primary" disabled={sectionLength === id ? true : false} onClick={this.onNext}>
                                    Next Section
                                </button>
                            </div>
                            <div className="col col-sm-2">
                                <button className="btn btn-primary" onClick={this.addSection} disabled={sectionLength === id ? false : true}>
                                    Add Section
                                </button>
                            </div>
                            <div className="col col-sm-2">
                                <button onClick={this.handlePreview} className="btn btn-primary" disabled={sectionLength > -1 ? false : true}>
                                    Preview
                                </button>
                            </div>
                            <div className="col col-sm-2">
                                <button onClick={this.handleSubmit} className="btn btn-primary" disabled={sectionLength > -1 ? false : true}>
                                    Submit
                                </button>
                            </div>
                            <div className="col col-sm-2">
                                <button onClick={this.onLast} className="btn btn-primary" disabled={sectionLength === id ? true : false}>
                                    Last Section
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        organizationsList: state.getorganization.organizationsList
    };
};
export default connect(mapStateToProps)(QuestionConfigure);
