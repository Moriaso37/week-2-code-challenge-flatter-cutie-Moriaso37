ocument.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const characterName = document.getElementById("character-name");
    const characterImage = document.getElementById("character-image");
    const voteCount = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const voteInput = document.getElementById("vote-input");
    const resetButton = document.getElementById("reset-votes");
    const characterForm = document.getElementById("character-form");
    const nameInput = document.getElementById("new-character-name");
    const imageInput = document.getElementById("new-character-image");
    let currentCharacter = null;

    
    fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => addCharacterToBar(character));
        });

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.classList.add("character");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
    }

    
    function displayCharacter(character) {
        currentCharacter = character;
        characterName.textContent = character.name;
        characterImage.src = character.image;
        characterImage.alt = character.name;
        voteCount.textContent = character.votes;
    }


    voteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (currentCharacter) {
            const votesToAdd = parseInt(voteInput.value, 10) || 0;
            currentCharacter.votes += votesToAdd;
            voteCount.textContent = currentCharacter.votes;
            voteInput.value = "";

        
            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: currentCharacter.votes })
            });
        }
    });

    
    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            voteCount.textContent = 0;

        
            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 })
            });
        }
    });

    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const image = imageInput.value.trim();

        if (name && image) {
            const newCharacter = { name, image, votes: 0 };

            
            fetch("http://localhost:3000/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            })
            .then(response => response.json())
            .then(savedCharacter => {
                addCharacterToBar(savedCharacter);
                displayCharacter(savedCharacter);
            });

            
            nameInput.value = "";
            imageInput.value = "";
        }
    });
});

