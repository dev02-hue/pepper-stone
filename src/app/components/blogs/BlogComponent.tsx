"use client";
import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaUser, FaTags, FaArrowRight, FaShareAlt, FaBookmark, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });

const BlogComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Blog categories
  const categories = [
    'All',
    'Investment Strategies',
    'Market Trends',
    'Cryptocurrency',
    'Wealth Management',
    'Financial Planning'
  ];

  // Sample blog data (20+ posts)
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Cryptocurrency Investments in 2023",
      excerpt: "Exploring the emerging trends in crypto investments and what they mean for your portfolio.",
      author: "Michael Chen",
      date: "2023-06-15",
      category: "Cryptocurrency",
      readTime: "8 min read",
      tags: ["crypto", "blockchain", "investing"],
      image: "/image1.webp"
    },
    {
      id: 2,
      title: "How to Diversify Your Investment Portfolio Effectively",
      excerpt: "Strategies for building a resilient investment portfolio that withstands market volatility.",
      author: "Sarah Johnson",
      date: "2023-06-10",
      category: "Investment Strategies",
      readTime: "10 min read",
      tags: ["diversification", "portfolio", "strategy"],
      image: "/image2.webp"
    },
    {
      id: 3,
      title: "Understanding Market Cycles: When to Buy and Sell",
      excerpt: "A deep dive into market cycles and timing your investments for maximum returns.",
      author: "Robert Williams",
      date: "2023-06-05",
      category: "Market Trends",
      readTime: "12 min read",
      tags: ["market", "timing", "analysis"],
      image: "/image3.webp"
    },
    {
      id: 4,
      title: "The Rise of ESG Investing: Profits with Purpose",
      excerpt: "How environmental, social, and governance factors are reshaping investment strategies.",
      author: "Emily Parker",
      date: "2023-05-28",
      category: "Wealth Management",
      readTime: "9 min read",
      tags: ["esg", "sustainable", "impact"],
      image: "/image4.webp"
    },
    {
      id: 5,
      title: "5 Common Investment Mistakes Beginners Make",
      excerpt: "Avoid these pitfalls when starting your investment journey to protect your capital.",
      author: "David Kim",
      date: "2023-05-22",
      category: "Financial Planning",
      readTime: "7 min read",
      tags: ["beginners", "mistakes", "education"],
      image: "/image5.avif"
    },
    {
      id: 6,
      title: "Real Estate vs. Stocks: Which Performs Better Long-Term?",
      excerpt: "Comparative analysis of two popular investment vehicles and their historical performance.",
      author: "Jennifer Lee",
      date: "2023-05-18",
      category: "Investment Strategies",
      readTime: "11 min read",
      tags: ["real estate", "stocks", "comparison"],
      image: "/image6.avif"
    },
    {
      id: 7,
      title: "The Psychology of Investing: Controlling Emotions in Volatile Markets",
      excerpt: "How to maintain discipline and avoid emotional decisions during market swings.",
      author: "Thomas Reynolds",
      date: "2023-05-12",
      category: "Wealth Management",
      readTime: "8 min read",
      tags: ["psychology", "behavior", "discipline"],
      image: "/image7.avif"
    },
    {
      id: 8,
      title: "How to Build Wealth with Index Funds",
      excerpt: "Why index funds remain one of the most effective tools for long-term wealth building.",
      author: "Amanda Smith",
      date: "2023-05-08",
      category: "Financial Planning",
      readTime: "6 min read",
      tags: ["index funds", "passive", "wealth"],
      image: "/image8.avif"
    },
    {
      id: 9,
      title: "Emerging Markets: Opportunities and Risks in 2023",
      excerpt: "Identifying high-potential emerging markets and how to approach them cautiously.",
      author: "Carlos Mendez",
      date: "2023-05-03",
      category: "Market Trends",
      readTime: "9 min read",
      tags: ["emerging", "global", "opportunities"],
      image: "/image9.avif"
    },
    {
      id: 10,
      title: "Tax-Efficient Investing Strategies for High Net Worth Individuals",
      excerpt: "Legal methods to minimize tax liabilities while maximizing investment returns.",
      author: "Rachel Goldstein",
      date: "2023-04-27",
      category: "Wealth Management",
      readTime: "12 min read",
      tags: ["tax", "hnwi", "strategies"],
      image: "/image10.avif"
    },
    {
      id: 11,
      title: "The Impact of AI on Financial Markets and Investing",
      excerpt: "How artificial intelligence is transforming investment analysis and decision making.",
      author: "Daniel Ng",
      date: "2023-04-21",
      category: "Market Trends",
      readTime: "10 min read",
      tags: ["ai", "technology", "innovation"],
      image: "/image11.avif"
    },
    {
      id: 12,
      title: "Retirement Planning: How Much Do You Really Need?",
      excerpt: "Calculating your retirement number based on lifestyle expectations and inflation.",
      author: "Patricia Wong",
      date: "2023-04-15",
      category: "Financial Planning",
      readTime: "8 min read",
      tags: ["retirement", "planning", "savings"],
      image: "/image12.avif"
    },
    {
      id: 13,
      title: "The Power of Compound Interest: Start Early, Retire Wealthy",
      excerpt: "Mathematical proof of why starting your investments early makes a dramatic difference.",
      author: "Kevin O'Brien",
      date: "2023-04-10",
      category: "Financial Planning",
      readTime: "7 min read",
      tags: ["compound", "interest", "math"],
      image: "/image13.avif"
    },
    {
      id: 14,
      title: "Alternative Investments: Beyond Stocks and Bonds",
      excerpt: "Exploring private equity, hedge funds, commodities, and other alternative assets.",
      author: "Lisa Thompson",
      date: "2023-04-05",
      category: "Investment Strategies",
      readTime: "11 min read",
      tags: ["alternatives", "assets", "diversification"],
      image: "/image14.avif"
    },
    {
      id: 15,
      title: "How Geopolitical Events Affect Global Markets",
      excerpt: "Understanding the connection between world events and your investment portfolio.",
      author: "James Wilson",
      date: "2023-03-30",
      category: "Market Trends",
      readTime: "9 min read",
      tags: ["geopolitics", "global", "events"],
      image: "/image15.avif"
    },
    {
      id: 16,
      title: "Value Investing Principles That Stand the Test of Time",
      excerpt: "Warren Buffett's timeless strategies and how to apply them today.",
      author: "Benjamin Graham",
      date: "2023-03-25",
      category: "Investment Strategies",
      readTime: "10 min read",
      tags: ["value", "buffett", "principles"],
      image: "/image16.avif"
    },
    {
      id: 17,
      title: "The Psychology of Market Bubbles and How to Spot Them",
      excerpt: "Behavioral patterns that precede market bubbles and how to protect yourself.",
      author: "Christine Armstrong",
      date: "2023-03-20",
      category: "Market Trends",
      readTime: "8 min read",
      tags: ["bubbles", "psychology", "warning"],
      image: "/image17.avif"
    },
    {
      id: 18,
      title: "Estate Planning: Protecting Your Wealth for Future Generations",
      excerpt: "Essential strategies for wealth transfer and minimizing estate taxes.",
      author: "Gregory Foster",
      date: "2023-03-15",
      category: "Wealth Management",
      readTime: "12 min read",
      tags: ["estate", "planning", "legacy"],
      image: "/image18.avif"
    },
    {
      id: 19,
      title: "The Role of Central Banks in Financial Markets",
      excerpt: "How monetary policy decisions impact your investments and what to watch for.",
      author: "Maria Rodriguez",
      date: "2023-03-10",
      category: "Market Trends",
      readTime: "9 min read",
      tags: ["central banks", "policy", "rates"],
      image: "/image19.avif"
    },
    {
      id: 20,
      title: "Building a Passive Income Portfolio That Lasts",
      excerpt: "Strategies for creating reliable income streams from your investments.",
      author: "Andrew Carter",
      date: "2023-03-05",
      category: "Financial Planning",
      readTime: "7 min read",
      tags: ["passive", "income", "dividends"],
      image: "/image20.webp"
    },
    {
      id: 21,
      title: "How to Analyze a Company's Financial Statements",
      excerpt: "A step-by-step guide to fundamental analysis for stock investors.",
      author: "Stephanie Young",
      date: "2023-02-28",
      category: "Investment Strategies",
      readTime: "11 min read",
      tags: ["analysis", "financials", "fundamentals"],
      image: "/image21.webp"
    },
    {
      id: 22,
      title: "The Evolution of Payment Systems and Investment Opportunities",
      excerpt: "From traditional banking to digital wallets and blockchain payment solutions.",
      author: "Nathaniel Pierce",
      date: "2023-02-22",
      category: "Cryptocurrency",
      readTime: "8 min read",
      tags: ["payments", "fintech", "blockchain"],
      image: "/image22.webp"
    }
  ];

  // Filter posts based on search term and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`${inter.className} bg-white py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Blog Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Investment Insights & Strategies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Expert analysis, market trends, and wealth-building strategies from our financial team
          </motion.p>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles, tags, or authors..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FD4A36] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-[#FD4A36] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Blog Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  {/* Category and Read Time */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FD4A36]/10 text-[#FD4A36]">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Author and Read Time */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaUser className="mr-1" /> {post.author}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center">
                        <FaTags className="mr-1" size={10} /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More and Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-[#FD4A36] font-medium flex items-center"
                    >
                      Read more <FaArrowRight className="ml-2" />
                    </motion.button>
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaBookmark />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaShareAlt />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 flex items-center">
                        <FaComment className="mr-1" /> <span className="text-xs">12</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-16 flex justify-center"
          >
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                Previous
              </button>
              <button className="px-4 py-2 border border-[#FD4A36] rounded-md text-white bg-[#FD4A36] cursor-pointer">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                Next
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogComponent;