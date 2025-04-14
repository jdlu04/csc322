##########################################
# 1. User Designation
##########################################

# Class to represent a member (user)
# Stores user ID, account status, token count, and any complaints submitted
# Users are registered as "Free" by default

# class Member:
#     def __init__(self, user_id, status="Free", tokens=20):
#         self.user_id = user_id      # Unique, three-digit, consecutive user ID
#         self.status = status        # "Free", "Paid", or "Administrator"
#         self.tokens = tokens        # ALl users start with 20 tokens
#         self.complaints = []        # List of complaints submitted by the user

# Depending on the user's status, display a different module
# match member.status:
#     case "Free":
#         displayFreeModule()
#     case "Paid":
#         displayPaidModule()
#     case "Administrator":
#         displayAdministratorModule()

##########################################
# 2. Input Options
##########################################

# Option 1: Typing into a textbox
# Option 2: Uploading a .txt file

##########################################
# 3. Blacklist Functionality
##########################################

# 3.1 Blacklist Dictionary
# Stores blacklisted words as keys and their asterisk-censored versions as values
# blacklist = {}

# 3.2 Asterisks Generator
# Returns a string of asterisks with the same length as the input word

# def censor(word):
#     return "*" * len(word)

# 3.3 Add Word to Blacklist
# Adds a word to the blacklist dictionary if it's not already present

# def addToBlacklist(word):
#     if word not in blacklist:
#         blacklist[word] = censor(word)

# 3.4 Remove Word from Blacklist
# Removes a word from the blacklist dictionary if it exists

# def removeFromBlacklist(word):
#     if word in blacklist:
#         blacklist.pop(word)

##########################################
# 4. Censor & Penalty on Blacklisted Word
##########################################

# Deducts tokens from the user equal to the length of the blacklisted word
# Replaces the word with its asterisk-censored version

# def wordPenalty(user, word):
#     if word in blacklist:
#         penalty = len(word)
#         user.tokens -= penalty
#         return blacklist[word]  # Censored word
#     return word

##########################################
# 5. Token Purchase
##########################################

# Adds tokens to the user's balance
# Each token costs $1, and any change is rounded down

# def buyTokens(user, amount):
#     user.tokens += int(amount)

##########################################
# 5. Submit text
##########################################
#   After user inputs text, the amount of words
#   are calculated and subtracted from a user's tokens
#   if the words are more than the user's tokens, 
#   We punish the user by subtracting half the amt
#   of tokens they have

#   def submitText(words):
#       if len(words.split()) > user.tokens:
#           user.tokens = user.tokens / 2
#           return
#       else:
#           LLMCorrection(words)

##########################################
# 6. LLM Correction Functionality
##########################################
#     Run text through LLM API or rule-based grammar checker
#     Return corrected version of text 
#     as well as a counter of how many words were changed
#     in order to charge the user
#     --> If counter == 0, that means user did not
#     make any mistakes and thus should be rewarded


# def correctText(text):
    # Tabulate words used in original prompt with a dictionary
    # dictOG = {}
    # for word in text:
    #   if word in dictOG:
    #       dictOG[word] += 1
    #   else dictOG[word] = 1

    #   
    # Pass input through LLM

    # Pass LLM changes through dict
    # dictLLM = {}
    # for word in text:
    #   if word in dictLLM:
    #       dictLLM[word] += 1
    #   else dictLLM[word] = 1

    # Compare the words in LLM output to original input
    # and charge user based on how many words have been changed

    # if int(words_changed) == 0:
    #   user.tokens += 3

    # else: 
    #   user.tokens -= int(words_chabed)

##########################################
# 8. Save Output as .txt File
##########################################

# def saveToFile(filename, text):
#     Open filename in write mode
#     Write text to file
#     Close file

##########################################
# 9. Invite Others to Collaborate on Text
##########################################

# def inviteCollaborator(document, collaboratorUserId):
#     Add user ID to list of authorized collaborators
#     Notify invited user if needed

##########################################
# 10. Complaint Submission Process
##########################################

# def submitComplaint(user, complaintText):
#     Append complaintText to user.complaints
#     Optionally send complaint to admin queue

##########################################
# 11. Ban Process for Users
##########################################

# def banUser(user):
#     Set user.status = "Banned"
#     Prevent future access or uploads


##########################################
# 14. Accept / Deny User Applications
##########################################
# Only the administrator has this functionality

# def reviewUserApplication(user, decision):
#     if decision == "accept":
#         user.status = "Paid"
#     elif decision == "deny":
#         user.status = "Free"
#     Notify user of outcome

##########################################
# 15. Fine / Temporarily Suspend Paid Users
##########################################

# def fineUser(user, amount):
#     user.tokens -= amount

# def suspendUser(user, duration):
#     user.status = "Suspended"
#     user.suspensionEnd = currentDate + duration

##########################################
# 16. Display Modules for Paid Users
##########################################

# def displayPaidFeatures():
#     Show advanced editing tools
#     Show collaboration tools
#     Show token shop, etc.

##########################################
# 17. Sharing Text Files
##########################################

# def shareFile(user, file, recipientId):
#     Grant access to recipient
#     Log sharing action for accountability

