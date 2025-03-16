import React, { useState, useRef, useEffect } from "react";
import { X, RotateCw } from "lucide-react";
import logoImg from "../assets/logo/logo.png";
import ReCAPTCHA from "react-google-recaptcha";

const cardColors = [
  "bg-pink-300",
  "bg-purple-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-red-300",
  "bg-indigo-300",
  "bg-orange-300",
  "bg-teal-300",
  "bg-cyan-300",
];

const randomEmojis = [
  "🔥",
  "💀",
  "😂",
  "🤔",
  "👀",
  "💯",
  "🙃",
  "✨",
  "🤡",
  "🎉",
  "💪",
  "🤦‍♂️",
];

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const Card = ({
  id,
  initialX,
  initialY,
  message,
  recipient,
  color,
  emoji,
  onRemove,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const rotation = Math.random() * 6 - 3;

  const handleMouseDown = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    dragStartPos.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStartPos.current.x,
        y: touch.clientY - dragStartPos.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={cardRef}
      className={`absolute ${color} p-4 rounded-lg shadow-xl w-64 cursor-move transform transition-transform ${
        isDragging ? "scale-105 shadow-2xl z-50" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        zIndex: isDragging ? 50 : 10,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="bg-white bg-opacity-80 px-2 py-1 rounded-md">
          <p className=" font-bold break-all">To: {recipient}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="text-gray-700 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="bg-white bg-opacity-70 p-3 rounded-md min-h-24">
        <p className="text-gray-800 font-medium break-words">{message}</p>
      </div>
      <div className="flex justify-start mt-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm text-gray-700 italic">- shitpost #{id}</span>
      </div>
    </div>
  );
};
const PostModal = ({ isOpen, onClose, onSubmit }) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipient.trim() || !message.trim()) {
      alert("Please fill in both recipient and message");
      return;
    }

    onSubmit({ recipient, message, captchaValue });

    setRecipient("");
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-purple-600">
          Dump Your Shit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Who's getting this shit?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What shit are you dumping?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
            onChange={handleCaptchaChange}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Dump Shit!
          </button>
        </form>
      </div>
    </div>
  );
};
const ShitpostGenerator = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchShitposts = async (pageNum) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/api/shitpost/posts?page=${pageNum}&limit=5`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newShitposts = await response.json();

      if (newShitposts.posts.length < 5) {
        setHasMore(false);
      }
      const newCards = newShitposts.posts.map((shitpost) => ({
        id: shitpost._id || shitpost.id,
        x: generateRandomPosition().x,
        y: generateRandomPosition().y,
        message: shitpost.message,
        recipient: shitpost.recipient,
        emoji: getRandomItem(randomEmojis),
        color: getRandomItem(cardColors),
      }));

      setCards((prevCards) =>
        pageNum === 1 ? newCards : [...prevCards, ...newCards]
      );

      setShowIntro(false);

      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching shitposts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const createShitpost = async (postData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/api/shitpost/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create shitpost");
      }

      const newShitpost = await response.json();

      const newCard = {
        id: newShitpost.insertedId || newShitpost.id,
        x: generateRandomPosition().x,
        y: generateRandomPosition().y,
        message: newShitpost.message,
        recipient: newShitpost.recipient,
        color: getRandomItem(cardColors),
        emoji: getRandomItem(randomEmojis),
      };

      setCards((prevCards) => [newCard, ...prevCards]);
    } catch (error) {
      console.error("Error creating shitpost:", error);
      alert("Failed to create shitpost. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShitposts(1);
  }, []);

  const generateRandomPosition = () => {
    if (!containerRef.current) return { x: 50, y: 50 };

    const width = containerRef.current.clientWidth - 280;
    const height = containerRef.current.clientHeight - 200;

    return {
      x: Math.max(20, Math.floor(Math.random() * width)),
      y: Math.max(20, Math.floor(Math.random() * height)),
    };
  };

  const removeCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const loadMoreCards = () => {
    setCards([]);
    fetchShitposts(page + 1);
  };

  useEffect(() => {
    const preventRefresh = (e) => {
      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault();
      }
    };

    const handleResize = () => {
      if (containerRef.current) {
        const maxWidth = containerRef.current.clientWidth - 280;
        const maxHeight = containerRef.current.clientHeight - 200;
        setCards((prevCards) =>
          prevCards.map((card) => ({
            ...card,
            x: Math.min(card.x, maxWidth),
            y: Math.min(card.y, maxHeight),
          }))
        );
      }
    };

    document.addEventListener("touchmove", preventRefresh, { passive: false });
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("touchmove", preventRefresh);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="bg-gray-100 w-full h-dvh overflow-hidden relative"
      ref={containerRef}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-20 flex justify-between items-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 shadow-md">
        <img
          src={logoImg}
          alt="logo"
          className="ml-1 h-12 w-30 sm:w-20 sm-10 md:h-10 md:w-30 "
        />
        <div className="flex items-center space-x-4 p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="bg-white hover:bg-gray-50 text-purple-500 font-bold py-2 px-4 rounded-full shadow-md transform transition-transform hover:scale-105 active:scale-95 flex items-center"
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 animate-spin" size={16} />
                Loading...
              </>
            ) : (
              "Dump Shit!"
            )}
          </button>
          {hasMore && (
            <button
              onClick={loadMoreCards}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 text-purple-500 font-bold py-2 px-4 rounded-full shadow-md transform transition-transform hover:scale-105 active:scale-95 flex items-center"
            >
              {isLoading ? (
                <>
                  <RotateCw className="mr-2 animate-spin" size={16} />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          )}
        </div>
      </div>

      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          initialX={card.x}
          initialY={card.y}
          message={card.message}
          recipient={card.recipient}
          color={card.color}
          emoji={card.emoji}
          onRemove={removeCard}
          style={{ willChange: "transform" }}
        />
      ))}
      {showIntro && cards.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 bg-white rounded-xl shadow-lg max-w-md z-20">
          <h2 className="text-xl font-bold mb-3">Welcome to the Chaos!</h2>
          <p className="mb-4">
            Loading shitpost cards from the server. Get ready for some random
            madness!
          </p>
          {isLoading && (
            <div className="flex justify-center items-center">
              <RotateCw className="animate-spin" size={24} />
            </div>
          )}
        </div>
      )}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createShitpost}
      />
    </div>
  );
};

export default ShitpostGenerator;
