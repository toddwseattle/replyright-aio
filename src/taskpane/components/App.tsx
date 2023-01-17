import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
/* global require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface MessageInfo {
  isReply: boolean;
}
export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  SubjId = 0;
  BodyId = 1;
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }
  setMessageFields() {
    const item = Office.context.mailbox.item;
    item.subject.getAsync((subject) => {
      if (subject.status == Office.AsyncResultStatus.Succeeded)
        this.setState({
          listItems: [{ icon: "PublicEMail", primaryText: `Subj: ${subject.value}` }, this.state.listItems[1]],
        });
    });
    item.body.getAsync("text", (body) => {
      if (body.status == Office.AsyncResultStatus.Succeeded)
        this.setState({
          listItems: [this.state.listItems[0], { icon: "MessageFill", primaryText: `Body: ${body.value}` }],
        });
    });
    this.setMessageFields();
  }
  componentDidMount() {
    this.setState({
      listItems: [
        { icon: "PublicEmail", primaryText: `The Subject will go here` },
        { icon: "MessageFill", primaryText: "The body will go here" },
      ],
    });
  }

  click = async () => {
    this.setMessageFields();
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        <HeroList message="selected message" items={this.state.listItems}>
          <p className="ms-font-l">
            Modify the source files, then click <b>Run</b>.
          </p>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
            Run
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}
