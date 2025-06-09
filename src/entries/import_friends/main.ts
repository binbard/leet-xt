import Manager from "@/core/manager";
import { FriendManager } from "@/core/utils/friendManager";
import { docFind } from "@/core/utils/helpers";

document.addEventListener('DOMContentLoaded', function (): void {
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const importButton = document.getElementById('import-button') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  let selectedFile: File | null = null;

  // Enable import button when a file is selected
  fileInput.addEventListener('change', function (event: Event): void {
    const target = event.target as HTMLInputElement;
    selectedFile = target.files ? target.files[0] : null;

    if (selectedFile) {
      importButton.disabled = false;
    } else {
      importButton.disabled = false;
    }
  });

  // Handle import button click
  importButton.addEventListener('click', function (): void {
    if (!selectedFile) {
      showResult('Please select a file first.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e: ProgressEvent<FileReader>): Promise<void> {
      const content = reader.result as string;
      await addFriendsFromFileContent(content);
    }

    reader.readAsText(selectedFile);
  });

  function showResult(message: string, type: 'success' | 'error'): void {
    resultDiv.textContent = message;
    resultDiv.className = type;
    resultDiv.style.display = 'block';
  }

  async function addFriendsFromFileContent(content: string) {
    try {
      let decoded_content = atob(content);
      let regex = /^[\w.;\-]+$/;
      if (!regex.test(decoded_content)) {
        showResult("Invalid users " + decoded_content, 'error');
        return;
      }
  
      let friendList = decoded_content.split(";");
  
      friendList = [...new Set(decoded_content.split(";"))];
      if (friendList.length > Manager.Friend.FRIENDS_LIMIT) {
        showResult(Manager.Friend.FRIENDS_MESSAGE, 'error');
        return;
      }
  
      let invalid_users: Array<string> = [];
      let valid_users: Array<string> = [];
  
      let promises = friendList.map(async username => {
        const user_exists = true;       // await Manager.Leetcode.isUserExist(username);
        if (user_exists) {
          valid_users.push(username);
        } else {
          invalid_users.push(username);
        }
      });
  
      const result = await Promise.all(promises).then(async () => {
        const friends = valid_users;
        if (friends.length == 0 && invalid_users.length > 0) {
          showResult("No valid users to import.", 'error');
          return;
        }
        await Manager.Storage.set(FriendManager.FRIENDS_LOC, friends);
        if (invalid_users.length > 0) {
          showResult(friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "), 'success');
        } else {
          showResult(friends.length + ' Friend(s) imported successfully.', 'success');
        }
        return;
      });
  
      return -1;
  
    } catch (e: any) {
      showResult(`Something went wrong\n${e.message}`, 'error');
      return;
    }
  }
});