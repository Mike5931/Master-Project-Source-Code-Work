function saveNewAttachmentsToDrive() {
  var folderId = "1kiA7xesDuBAbqgWqsweM7fTX7iDCxwpp"; // Replace with the ID of the destination folder in Google Drive
  var labelName = "SavedData"; // Replace with the name of the Gmail label
  var lastExecutionTime = getLastExecutionDate();
  var label = GmailApp.getUserLabelByName(labelName);
  var threads = label.getThreads(); // Get all threads in the label
  var driveFolder = DriveApp.getFolderById(folderId);
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      if (message.getDate() > new Date(lastExecutionTime)) { // Check if the message is after the last execution
        var attachments = message.getAttachments();
        for (var k = 0; k < attachments.length; k++) {
          var attachment = attachments[k];
          var attachmentBlob = attachment.copyBlob();
          var fileName = attachment.getName();
          driveFolder.createFile(attachmentBlob).setName(fileName);
        }
      }
    }
    // threads[i].removeLabel(GmailApp.getUserLabelByName("SavedData"));
  }
  updateLastExecutionDate();
}

function getLastExecutionDate() {
  var properties = PropertiesService.getUserProperties();
  return properties.getProperty("lastExecutionDate") || "2023-09-01";
}

function resetLastExecutionDate() {
  PropertiesService.getUserProperties().deleteProperty("lastExecutionDate");
}

function updateLastExecutionDate() {
  var now = new Date();
  var dateString = now.toISOString().split("T")[0];
  var properties = PropertiesService.getUserProperties();
  properties.setProperty("lastExecutionDate", dateString);
}
