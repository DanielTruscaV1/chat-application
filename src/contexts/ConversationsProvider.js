//Import React
import React, {useContext, useState} from "react";
//Import the hook 'useLocalStorage'
import useLocalStorage from '../hooks/useLocalStorage'
import { useContacts } from "./ContactsProvider";
const ConversationsContext = React.createContext()
export function useConversations(){
    return useContext(ConversationsContext)
}

//Create and export the functional component 'ConversationsProvider'
export function ConversationsProvider({children}){
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
    const {contacts} = useContacts()
    function createConversation(recipients){
        setConversations(prevConversations => {
            return [...prevConversations, {recipients, messages:[]}]
        })
    }
    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
                return contact.id === recipient
            })
            const name = (contact && contact.name) || recipient
            return {id:recipient, name}
        })
        const selected = index === selectedConversationIndex
        return {...conversation, recipients, selected}
    })
    const value = {
        conversations:formattedConversations,
        selectedConversationIndex:setSelectedConversationIndex,
        createConversation
    }
    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
}