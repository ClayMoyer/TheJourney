import React, { useState } from "react";
import { TextField, Button, Box, Typography, LinearProgress } from "@mui/material";
import journeyLogo from "../images/journey1245.png";
import auth from '../utils/auth';
import RedirectLogin from './Redirect-Login';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_JOURNAL_ENTRY } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

import '../../src/assets/css/JournalEntry.css';

const fontType = 'papyrus'

const JournalEntry = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const lastLoggedIn = "July 13, 2023";
  const challengesCompleted = 10;
  const challengePercent = 0.25;

  const [addJournalEntry] = useMutation(ADD_JOURNAL_ENTRY);

  const handleEntryChange = (event) => {
    setEntry(event.target.value);
  };

  const handleSaveEntry = () => {
    const timestamp = new Date().toLocaleString();

    addJournalEntry({
      variables: {
        title: timestamp,
        body: entry,
        dateCreated: timestamp,
      },
      update(cache, { data: { addJournal } }) {
        const newEntry = {
          title: timestamp,
          body: addJournal.body,
          dateCreated: addJournal.dateCreated,
        };
        setEntries([...entries, newEntry]);
        window.location.reload();
      },
    });

    setEntry("");
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setEntries(updatedEntries);
  };

  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);

  if (!auth.loggedIn()) {
    return <RedirectLogin />;
  }

  if (meLoading) {
    return <p>Loading...</p>;
  }

  const journalEntries = meData?.me?.journals || [];

  return (
    <Box
    className="journal-container"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
      textAlign="center"
      bgcolor="#FE5720"
      color="white"
    >
      <img src={journeyLogo} alt="the journey logo" />

      <Typography variant="h3" gutterBottom style={{ fontFamily: fontType }}>
        My Journal
      </Typography>

      <Box width={400}>
        <Typography variant="h5" gutterBottom style={{ fontFamily: fontType }}>
          Last Logged In: {lastLoggedIn}
        </Typography>
        <Typography variant="h5" gutterBottom style={{ fontFamily: fontType }}>
          Challenges Completed: {challengesCompleted}
        </Typography>
        Current Challenge Progress
        <LinearProgress
          className="progress-bar"
          variant="determinate"
          value={challengePercent * 100}
          style={{ backgroundColor: "#000009" }}
        />
        <TextField
          label="Journal Entry"
          multiline
          rows={4}
          value={entry}
          onChange={handleEntryChange}
          fullWidth
          margin="normal"
          
        />
        <Button
          variant="contained"
          onClick={handleSaveEntry}
          fullWidth
          style={{
            fontFamily: fontType,
            backgroundColor:'black',
            color: "#E5AB24"
          }}
        >
          Save Entry
        </Button>
      </Box>

      <Box
        width={400}
        marginTop={2}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        maxHeight={300}
        overflow="auto"
        color="white"
        bgcolor="" /* Adjust the background color */
      >
        <Typography variant="h6" style={{ fontFamily: fontType }}>
          Journal Entries:
        </Typography>
        {journalEntries.map(({ _id, title, body, dateCreated }) => (
          <Box
            key={_id}
            marginY={1}
            textAlign="center"
            display="flex"
            alignItems="center"
          >
             <Typography
              style={{ width: "200px", fontFamily: fontType }}
            >
              {title}
            </Typography>
            <Typography variant="body2">---------------------------------------<br/> {body}</Typography> {/* Show the colon between timestamp and entry body */}
            <Typography variant="caption" marginLeft={1}>
              
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default JournalEntry;
