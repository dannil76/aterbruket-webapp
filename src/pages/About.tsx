/* eslint-disable react/no-danger */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-console */
import React, { FC, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { DefaultEditor } from "react-simple-wysiwyg";
import { updatePage } from "../graphql/mutations";
import { getPage } from "../graphql/queries";
import { Page, GetPageQuery } from "../API";
import UserContext from "../contexts/UserContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
  margin: 0 0 50px 0;
`;

const About: FC = () => {
  const [page, setPage] = useState<Page | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const fetchPageContent = async () => {
    // try {
    //   await API.graphql({
    //     query: createPage,
    //     variables: {
    //       input: {
    //         title: "Vadå Haffa?",
    //         slug: "about",
    //         content: "<h1>Titel</h1><p>Text</p>",
    //       },
    //     },
    //   });
    // } catch (error) {
    //   console.log("Error", error);
    // }

    try {
      const response = (await API.graphql(
        graphqlOperation(getPage, { slug: "about" })
      )) as GraphQLResult<GetPageQuery>;
      const pageData = response?.data?.getPage;

      setPage({
        ...pageData,
        __typename: "Page",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPageContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedPage = await API.graphql({
        query: updatePage,
        variables: {
          input: {
            id: page?.id,
            slug: page?.slug,
            title: page?.title,
            content: page?.content,
          },
        },
      });
      console.log("updatedPage", updatedPage);
    } catch (error) {
      console.log("Update page error: ", error);
    }

    setIsEditing(false);
  };

  const handleEditorChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLTextAreaElement;
    const newPageState: Page = Object.assign({}, page, {
      content: target.value,
    });
    setPage(newPageState);
  };

  const handleCancelEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("handleCancelEdit");
    fetchPageContent();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <main>
        <Container>
          <form onSubmit={handleSubmit}>
            <DefaultEditor
              value={page?.content || ""}
              onChange={handleEditorChange}
            />

            <br />
            <br />

            <button type="submit">Spara</button>
            <br />
            <br />

            <button type="button" onClick={handleCancelEdit}>
              Avbryt
            </button>
          </form>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container>
        {user.isAdmin && (
          <button type="button" onClick={editClick}>
            Ändra
          </button>
        )}

        <article
          dangerouslySetInnerHTML={{
            __html: page?.content || "",
          }}
        />
      </Container>
    </main>
  );
};

export default About;
