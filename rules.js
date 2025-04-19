class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        // reset inventory at start
        this.engine.inventory = [];
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        // if this location requires items, check inventory
        if (locationData.RequiredInventory) {
            if (!this.engine.hasItems(locationData.RequiredInventory)) {
                // show locked message or default
                const msg = locationData.LockedMessage || "You don't have all the required items to proceed.";
                this.engine.show(msg);
                // fallback choice
                const back = locationData.Fallback || this.engine.storyData.InitialLocation;
                this.engine.addChoice("Go Back", { Target: back });
                // show current inventory
                this.engine.showInventory();
                return;
            }
        }

        // list choices if available
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }

        // display inventory at bottom
        this.engine.showInventory();
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            // add to inventory if applicable
            if (choice.InventoryAdd) {
                this.engine.addItem(choice.InventoryAdd);
            }
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

// helper to display inventory
Engine.prototype.showInventory = function() {
    if (this.inventory.length > 0) {
        this.show("<strong>Inventory:</strong> " + this.inventory.join(", "));
    }
};

// boot the game
Engine.load(Start, 'myStory.json');