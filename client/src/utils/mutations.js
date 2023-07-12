import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_CHALLENGE = gql`
  mutation addChallenge($title: String!, $description: String!, $startDate: String!) {
    addChallenge(title: $title, description: $description, startDate: $startDate) {
      title
      description
      startDate
    }
  }
`;

export const ADD_TASK = gql`
  mutation addTask($taskTitle: String!, $description: String!, $frequency: Int!) {
    addTask(taskTitle: $taskTitle, description: $description, frequency: $frequency) {
      title
      description
      startDate
    }
  }
`;

export const ADD_JOURNAL_ENTRY = gql`
  mutation addJournal($title: String!, $body: String!, $dateCreated: String!) {
    addJournal(title: $title, body: $body, dateCreated: $dateCreated) {
      _id
     username
    }
  }
`;

export const REMOVE_TASK = gql`
  mutation removeTask($_id: ID){
    removeTask(_id: $_id){
      title
      description
      tasks{
        taskTitle
        description
      }
    }
  }
`