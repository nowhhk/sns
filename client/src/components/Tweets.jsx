import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';

const Tweets = memo(({ tweetService }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    tweetService
      .getTweets()
      .then((tweets) => setTweets([...tweets]))
      //   .then(() => console.log('14', tweets))
      .catch(onError);
  }, [tweetService]);

  const onCreated = (tweet) => {
    // setTweets((tweets) => [tweet, ...tweets]);
    tweetService
      .getTweets()
      .then((tweets) => setTweets([...tweets]))
      .catch((error) => setError(error.toString()));
  };
  const onDelete = (tweetId) =>
    tweetService
      .deleteTweet(tweetId)
      .then(() =>
        setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId))
      )
      .catch((error) => setError(error.toString()));

  const onUpdate = (tweetId, text) =>
    tweetService
      .updateTweet(tweetId, text)
      .then((updated) =>
        setTweets((tweets) =>
          tweets.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch((error) => error.toString());

  const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };
  return (
    <>
      <NewTweetForm
        tweetService={tweetService}
        onCreated={onCreated}
        onError={onError}
      />
      {error && <Banner text={error} isAlert={true} />}
      <ul className="w-full h-full overflow-y-auto">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUsernameClick={onUsernameClick}
          />
        ))}
      </ul>
    </>
  );
});

export default Tweets;
