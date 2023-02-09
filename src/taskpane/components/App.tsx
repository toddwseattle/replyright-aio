/* global Office */
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

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  getSomeGPTStuff() {
    const useLocal = false;
    const localUrl = "http://localhost:7071/api/getGPT3?prompt=";
    const remoteUrl =
      "https://replyright-ai-1.azurewebsites.net/api/getgpt3?code=OjY2sPgsqOw-HK-wpHcfFXBhRFz9Z3oBEAavh5LINVE_AzFus3Ke3g%3D%3D&prompt=";
    let fetchUrl = useLocal ? localUrl : remoteUrl;
    fetch(fetchUrl + this.state.listItems[1].primaryText)
      .then((response) => response.text())
      .then((data) => {
        this.setState({
          listItems: [this.state.listItems[0], { icon: "MessageFill", primaryText: `Message Body: ${data}` }],
        });
      });
  }
  SubjId = 0;
  BodyId = 1;
  constructor(props: AppProps, context: AppState) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }
  setMessageFields() {
    if (Office.context.mailbox.item) {
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
            listItems: [this.state.listItems[0], { icon: "MessageFill", primaryText: `Message Body: ${body.value}` }],
          });
      });
    }
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
    this.getSomeGPTStuff();
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/replythumb-300.png")}
          message="Please sideload ReplyRight to see the application info"
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header
          logo={require("./../../../assets/replythumb-300.png")}
          title={this.props.title}
          message="ReplyRight AI"
        />
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
