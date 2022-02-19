import React, { useState, useRef } from "react";
import moment from "moment";
import classnames from "classnames";

import { Container, Row, Col } from "reactstrap";
import { TextField, Button } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DateTimePicker from '@mui/lab/DateTimePicker';

import { createEvent } from "../../../../actions/EventActions";

import { DATE_TIME_INPUT_FORMAT } from "../../../../constants/app";

import styles from "./create-event-form.module.scss";


const CreateEventForm = () => {
    const [title, setTitle] = useState("");
    const [showTitleError, setShowTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [startDate, setStartDate] = React.useState(null);
    const [isStartDateDialogOpen, setIsStartDateDialogOpen] = React.useState(false);
    const [showStartDateError, setShowStartDateError] = useState(false);
    const [endDate, setEndDate] = React.useState(null);
    const [isEndDateDialogOpen, setIsEndDateDialogOpen] = React.useState(false);
    const [showEndDateError, setShowEndDateError] = useState(false);

    const thumbnailFileInputRef = useRef(null);

    const handleEventCreation = async () => {
        if (
            title &&
            startDate &&
            (endDate && (endDate >= startDate))
        ) {
            await createEvent({ title, description, image: thumbnailFile, startDate, endDate });

            setTitle("");
            setDescription("");
            setThumbnail("");
            setThumbnailFile(null);
            setStartDate(null);
            setEndDate(null);
        } else {
            !title && setShowTitleError(true);
            !startDate && setShowStartDateError(true);
            (!endDate || (endDate < startDate)) && setShowEndDateError(true);
        }
    };

    return (
        <Container tag="section" className={styles.createEventForm}>
            <Row>
                <Col className={styles.title}>
                    Create Event Form
                </Col>
            </Row>

            <Row className={styles.formFieldContainer}>
                <Col>
                    <label
                        htmlFor="title"
                        className={classnames(styles.label, styles.required)}
                    >
                        Title
                    </label>

                    <TextField
                        id="title"
                        className={styles.input}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setShowTitleError(!e.target.value);
                        }}
                        placeholder="Title"
                        required
                        error={showTitleError}
                        fullWidth
                        size="small"
                    />
                </Col>
            </Row>

            <Row className={styles.formFieldContainer}>
                <Col>
                    <label
                        htmlFor="description"
                        className={styles.label}
                    >
                        Description
                    </label>

                    <TextField
                        id="description"
                        className={styles.input}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        multiline
                        rows={4}
                        fullWidth
                        size="small"
                    />
                </Col>
            </Row>

            <Row className={classnames(styles.formFieldContainer, styles.thumbnailContainer)}>
                <Col>
                    <label
                        htmlFor="thumbnail"
                        className={classnames(styles.label, styles.thumbnailLabel)}
                    >
                        <div className={styles.labelText}>Thumbnail</div>
                        <div>
                            <input
                                className={styles.fileInput}
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                placeholder="Thumbnail"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setThumbnail(URL.createObjectURL(e.target.files[0]));
                                        setThumbnailFile(e.target.files[0]);
                                    }
                                }}
                                ref={thumbnailFileInputRef}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                endIcon={<PhotoCamera />}
                                type="button"
                            >
                                Upload
                            </Button>
                        </div>
                    </label>

                    <Button
                        variant="text"
                        onClick={() => {
                            setThumbnail("");
                            setThumbnailFile(null);
                            thumbnailFileInputRef.current.value = null;
                        }}
                    >
                        Clear
                    </Button>

                    {
                        thumbnailFile &&
                        <div className={styles.thumbnailFileName}>
                            {thumbnailFile.name}
                        </div>
                    }

                    {
                        thumbnailFile &&
                        <img
                            className={styles.thumbnailPreview}
                            src={thumbnail}
                        />
                    }
                </Col>
            </Row>

            <Row className={classnames(styles.formFieldContainer, styles.dateContainer)}>
                <Col>
                    <label
                        htmlFor="startDateTimeInput"
                        className={classnames(styles.label, styles.required)}
                    >
                        Start date
                    </label>
                </Col>

                <Col>
                    <DateTimePicker
                        value={startDate}
                        inputFormat={DATE_TIME_INPUT_FORMAT}
                        mask=""
                        minDate={moment().startOf('day')}
                        ampm={false}
                        showTodayButton
                        // Props applied to the Input element, which is the wrapper for <input>
                        InputProps={{
                            className: styles.dateTimeInputWrapper,
                            error: showStartDateError,
                            required: true
                        }}
                        // Props applied to the <input> element.
                        inputProps={{
                            id: "startDateTimeInput",
                            className: styles.dateTimeInput,
                            placeholder: "Select date and time",
                            readOnly: true
                        }}
                        open={isStartDateDialogOpen}
                        onOpen={() => setIsStartDateDialogOpen(true)}
                        onClose={() => setIsStartDateDialogOpen(false)}
                        onChange={(newValue) => {
                            setStartDate(newValue.startOf('minute'));
                            setShowStartDateError(!newValue);
                        }}
                        renderInput={(props) => <TextField
                            // Class applied to DateTimePicker container (i.e. root)
                            className={styles.dateTimePicker}
                            onClick={(e) => setIsStartDateDialogOpen(true)}
                            required
                            size="small"
                            {...props}
                        />}
                    />
                </Col>
            </Row>

            <Row className={classnames(styles.formFieldContainer, styles.dateContainer)}>
                <Col>
                    <label
                        htmlFor="endDateTimeInput"
                        className={classnames(styles.label, styles.required)}
                    >
                        End date
                    </label>
                </Col>

                <Col>
                    <DateTimePicker
                        value={endDate}
                        inputFormat={DATE_TIME_INPUT_FORMAT}
                        mask=""
                        minDateTime={startDate}
                        ampm={false}
                        showTodayButton
                        // Props applied to the Input element, which is the wrapper for <input>
                        InputProps={{
                            className: classnames(styles.dateTimeInputWrapper, {[styles.disabled]: !startDate}),
                            error: showEndDateError,
                            required: true
                        }}
                        // Props applied to the <input> element.
                        inputProps={{
                            id: "endDateTimeInput",
                            className: classnames(styles.dateTimeInput, {[styles.disabled]: !startDate}),
                            placeholder: "Select date and time",
                            readOnly: true
                        }}
                        disabled={!startDate}
                        open={isEndDateDialogOpen}
                        onOpen={() => setIsEndDateDialogOpen(true)}
                        onClose={() => setIsEndDateDialogOpen(false)}
                        onChange={(newValue) => {
                            setEndDate(newValue.startOf('minute'));
                            setShowEndDateError(!newValue);
                        }}
                        renderInput={(props) => <TextField
                            // Class applied to DateTimePicker container (i.e. root)
                            className={classnames(styles.dateTimePicker, {[styles.disabled]: !startDate})}
                            onClick={(e) => startDate && setIsEndDateDialogOpen(true)}
                            required
                            size="small"
                            {...props}
                        />}
                    />
                </Col>
            </Row>

            <Row className={styles.submitButtonContainer}>
                <Col>
                    <Button
                        variant="contained"
                        component="span"
                        onClick={handleEventCreation}
                        size="large"
                    >
                        Create
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateEventForm;
