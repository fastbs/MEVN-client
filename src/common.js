export default {
    onFocusBlur() {
        let input = document.querySelectorAll(
            ".e-input-group .e-input,.e-float-input.e-input-group input"
        );

        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener("focus", function () {
                this.parentNode.classList.add("e-input-focus");
            });
            input[i].addEventListener("blur", function () {
                this.parentNode.classList.remove("e-input-focus");
            });
        }

    },

}