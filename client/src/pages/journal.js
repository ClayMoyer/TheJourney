import React, { useState } from "react";
import { TextField, Button, Box, Typography, IconButton, LinearProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import journeyLogo from "../images/journey.jpg";
import auth from '../utils/auth';
import RedirectLogin from './Redirect-Login';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_JOURNAL_ENTRY } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

import '../../src/assets/css/JournalEntry.css';

const JournalEntry = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const lastLoggedIn = "June 25, 2023";
  const challengesCompleted = 10;
  const challengePercent = 0.5;

  const [addJournalEntry] = useMutation(ADD_JOURNAL_ENTRY);

  const handleEntryChange = (event) => {
    setEntry(event.target.value);
  };

  const handleSaveEntry = () => {
    const timestamp = new Date().toLocaleString();

    addJournalEntry({
      variables: {
        title: "Journal Entry",
        body: entry,
        dateCreated: timestamp,
      },
      update(cache, { data: { addJournal } }) {
        const newEntry = {
          _id: addJournal._id,
          title: addJournal.title,
          body: addJournal.body,
          dateCreated: addJournal.dateCreated,
        };
        setEntries([...entries, newEntry]);
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
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
      textAlign="center"
      bgcolor="#FE5720"
      color="#000009"
    >
      <img src={journeyLogo} alt="the journey logo" />

      <Typography variant="h3" gutterBottom style={{ fontFamily: "Papyrus" }}>
        My Journal
      </Typography>

      <Box width={400}>
        <Typography variant="h5" gutterBottom style={{ fontFamily: "Papyrus" }}>
          Last Logged In: {lastLoggedIn}
        </Typography>
        <Typography variant="h5" gutterBottom style={{ fontFamily: "Papyrus" }}>
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
            fontFamily: "Papyrus",
            backgroundColor: "#E5AB24",
            color: "#556062"
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
        bgcolor="#FE5720" /* Adjust the background color */
      >
        <Typography variant="h6" style={{ fontFamily: "Papyrus" }}>
          Journal Entries:
        </Typography>
        {journalEntries.map((entry, index) => (
          <Box
            key={index}
            marginY={1}
            textAlign="center"
            display="flex"
            alignItems="center"
          >
            <Typography>{entry.title}</Typography>
            <Typography variant="body2">{entry.body}</Typography> {/* Show the entry body */}
            <Typography variant="caption" marginLeft={1}>
              {entry.dateCreated}
            </Typography>
            <IconButton
              color="error"
              onClick={() => handleDeleteEntry(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default JournalEntry;
