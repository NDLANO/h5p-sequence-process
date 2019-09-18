import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from "../../context/SequenceProcessContext";
import Popover from "../Popover/Popover";
import classnames from 'classnames';

function Comment(props) {

    const [showPopover, togglePopover] = useState(false);
    const [comment, setComment] = useState(props.comment);

    const context = useContext(SequenceProcessContext);

    function handleToggle() {
        if( props.onClick ){
            return props.onClick();
        }
        if( !showPopover){
            setComment(props.comment || "");
        } else {
            props.onCommentChange(comment);
        }
        togglePopover(!showPopover);
    }

    return (
        <Popover
            handleClose={handleToggle}
            show={showPopover}
            popoverContent={(
                <div>
                        <textarea
                            placeholder={context.translations.typeYourReasonsForSuchAnswers}
                            value={comment}
                            onChange={event => setComment(event.currentTarget.value)}
                        />
                </div>
            )}
        >
            <button
                onClick={handleToggle}
                className={classnames("h5p-sequence-action", {
                    'h5p-sequence-action-active': props.comment && props.comment.length > 0,
                })}
                onKeyDown={event => {
                    if(event.keyCode === 13){
                        handleToggle();
                    }
                }}
            >
                <i
                    className={"fa fa-commenting-o"}
                />
            </button>
        </Popover>
    );
}

Comment.propTypes = {
    onCommentChange: PropTypes.func,
    comment: PropTypes.string,
    onClick: PropTypes.func,
};

export default Comment;
//
// import React from 'react';
// import PropTypes from 'prop-types';
// import {SequenceProcessContext} from "../../context/SequenceProcessContext";
// import Popover from "../Popover/Popover";
//
// export default class Comment extends React.Component {
//
//     static contextType = SequenceProcessContext;
//
//     static propTypes = {
//         onCommentChange: PropTypes.func,
//         comment: PropTypes.string,
//     };
//
//     state = {
//         showPopover: false,
//         comment: '',
//     };
//
//     constructor(props) {
//         super(props);
//         this.onToggleModal = this.onToggleModal.bind(this);
//         this.handleCommentChange = this.handleCommentChange.bind(this);
//     }
//
//     onToggleModal() {
//         this.setState({
//             showPopover: !this.state.showPopover
//         }, this.props.onCommentChange(this.state.comment))
//     }
//
//     handleCommentChange(event) {
//         this.setState({
//             comment: event.target.value,
//         });
//     }
//
//     render() {
//         const {
//             translations
//         } = this.context;
//
//         return (
//             <Popover
//                 handleClose={this.onToggleModal}
//                 show={this.state.showPopover}
//                 popoverContent={(
//                     <div>
//                         <textarea
//                             placeholder={translations.typeYourReasonsForSuchAnswers}
//                             onChange={this.handleCommentChange}
//                             value={this.state.comment}
//                         />
//                     </div>
//                 )}
//             >
//                 <div
//                     onClick={this.onToggleModal}
//                     className={"h5p-sequence-action"}
//                 >
//                     <i
//                         className={"fa fa-commenting-o"}
//                     />
//                 </div>
//             </Popover>
//         );
//     }
// }