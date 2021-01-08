window.addEventListener('DOMContentLoaded', () => {
    findMyLikeButtonListener();
})

let findMyLikeButtonListener = () => {
    $(".myLike-image").click((event) => {
        let $button = $(event.target),
            boardId = $button.data("boardId");
            targetUsername = $button.data("targetUsername");

        $.get(`/${targetUsername}/${boardId}/findMyLike`, (results = {}) => {
            let data = results.data;
            if (Data && data.success) {
                $button
                    .src("/image/heartOn.png")
            }
        });
    });
}
