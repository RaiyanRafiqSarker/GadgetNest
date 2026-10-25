document.addEventListener("DOMContentLoaded", function () {
    const getImageInputs = () => [
        ...document.querySelectorAll('input[type="file"]')
    ].filter((input) => input.name.toLowerCase().includes("image"));

    const ensureInlineRows = (needed) => {
        const addButton = document.querySelector(
            '.js-inline-admin-formset .add-row a, .inline-related .add-row a, .add-row a'
        );

        if (!addButton || needed <= 0) return;

        const emptyInputs = getImageInputs().filter(
            (input) => !input.files || input.files.length === 0
        );

        let clicks = 0;
        while (emptyInputs.length + clicks < needed) {
            addButton.click();
            clicks += 1;
        }
    };

    const assignFilesToInputs = (files) => {
        const inputs = getImageInputs();
        const availableInputs = inputs.filter(
            (input) => !input.files || input.files.length === 0
        );

        if (availableInputs.length < files.length) {
            ensureInlineRows(files.length - availableInputs.length);
        }

        const refreshedInputs = getImageInputs().filter(
            (input) => !input.files || input.files.length === 0
        );

        files.forEach((file, index) => {
            const target = refreshedInputs[index];
            if (!target) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            target.files = dataTransfer.files;
            target.multiple = true;
            target.setAttribute("multiple", "multiple");
            target.dispatchEvent(new Event("change", { bubbles: true }));
        });
    };

    const imageInputs = getImageInputs();

    imageInputs.forEach((input) => {
        input.multiple = true;
        input.setAttribute("multiple", "multiple");

        if (input.parentNode && input.parentNode.querySelector(".drag-drop-upload-zone")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "drag-drop-upload-zone";
        wrapper.style.border = "2px dashed #999";
        wrapper.style.borderRadius = "10px";
        wrapper.style.padding = "24px 16px";
        wrapper.style.textAlign = "center";
        wrapper.style.marginTop = "10px";
        wrapper.style.marginBottom = "10px";
        wrapper.style.cursor = "pointer";
        wrapper.style.background = "#fafafa";

        wrapper.innerHTML = `
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">
                Drag & Drop Images Here
            </p>
            <p style="margin: 0; color: #666; font-size: 12px;">
                or click to choose files
            </p>
        `;

        input.style.display = "none";
        input.parentNode.insertBefore(wrapper, input);

        wrapper.addEventListener("click", function () {
            input.click();
        });

        wrapper.addEventListener("dragover", function (event) {
            event.preventDefault();
            wrapper.style.background = "#eef6ff";
            wrapper.style.borderColor = "#007bff";
        });

        wrapper.addEventListener("dragleave", function () {
            wrapper.style.background = "#fafafa";
            wrapper.style.borderColor = "#999";
        });

        wrapper.addEventListener("drop", function (event) {
            event.preventDefault();
            wrapper.style.background = "#fafafa";
            wrapper.style.borderColor = "#999";

            const droppedFiles = Array.from(event.dataTransfer.files || []);
            if (droppedFiles.length === 0) return;

            if (droppedFiles.length > 1 || input.multiple) {
                assignFilesToInputs(droppedFiles);
                const label = droppedFiles.length > 1
                    ? `${droppedFiles.length} images selected`
                    : droppedFiles[0].name;
                wrapper.querySelector("p").textContent = "Selected: " + label;
                return;
            }

            const file = droppedFiles[0];
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            wrapper.querySelector("p").textContent = "Selected: " + file.name;
        });

        input.addEventListener("change", function () {
            if (input.files && input.files.length > 0) {
                const names = Array.from(input.files).map((file) => file.name);
                wrapper.querySelector("p").textContent =
                    names.length > 1
                        ? "Selected: " + names.length + " files"
                        : "Selected: " + names[0];
            }
        });
    });

    if (imageInputs.length === 0) {
        return;
    }
});