
import { ContentItem, Category, Educator, ShortItem, NoteItem, ChartItem, MessageItem } from '../types';

export const educators: Educator[] = [
    { id: 'dr-ram', name: 'Dr. Ram', title: 'Wealthcon Founder', avatarUrl: 'https://i.pravatar.cc/150?u=dr-ram' },
    { id: 'market-masters', name: 'Market Masters', title: 'Stock Market Analysis', avatarUrl: 'https://i.pravatar.cc/150?u=mm' },
    { id: 'wealth-wizards', name: 'Wealth Wizards', title: 'Financial Planning', avatarUrl: 'https://i.pravatar.cc/150?u=ww' },
    { id: 'admin', name: 'Admin', title: 'Platform Updates', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
];

const allContent: Omit<ContentItem, 'id' | 'releaseDate' | 'educatorId' | 'watchPercentage' | 'viewCount'>[] = [
    {
        title: 'The Physician\'s Guide to Angel Investing',
        description: 'Unlock the secrets to high-growth startup investing.',
        longDescription: 'Join Dr. Ankit Runwal as he demystifies the world of angel investing. Learn how to evaluate startups, understand term sheets, and build a portfolio of promising early-stage companies. This course is designed specifically for medical professionals looking to diversify their investments beyond traditional markets.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 240,
        tags: ['Investing', 'Startups', 'Advanced'],
    },
    {
        title: 'Retirement Planning for Doctors',
        description: 'Secure your financial future with tailored strategies.',
        longDescription: 'Navigate the complexities of retirement planning with a course designed for the unique financial journey of a doctor. Covers everything from pension plans to tax-efficient withdrawal strategies.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 180,
        tags: ['Retirement', 'Planning', 'Intermediate'],
    },
    {
        title: 'Live Q&A: Real Estate Syndication',
        description: 'Ask experts your toughest questions.',
        longDescription: 'A live session with top real estate investors. This is your chance to get answers to all your questions about pooling capital to invest in large-scale property deals.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 75,
        tags: ['Real Estate', 'Live Event', 'All Levels'],
    },
    {
        title: 'Mastering Medical Practice Finances',
        description: 'Optimize your practice for maximum profitability.',
        longDescription: 'Learn the business side of medicine. This course covers billing, overhead management, and strategic financial decisions to make your practice thrive.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 320,
        tags: ['Business', 'Finance', 'Advanced'],
    },
    {
        title: 'Introduction to Stock Market Investing',
        description: 'Build a solid foundation for your investment journey.',
        longDescription: 'A beginner-friendly guide to the stock market. Understand key concepts like stocks, bonds, ETFs, and mutual funds, and learn how to build your first diversified portfolio.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 150,
        tags: ['Stocks', 'Beginner', 'Investing'],
    },
    {
        title: 'Tax Strategies for High-Income Earners',
        description: 'Keep more of what you earn.',
        longDescription: 'Discover legal strategies and deductions that can significantly lower your tax burden. Essential viewing for every practicing physician.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 90,
        tags: ['Taxes', 'Wealth Management', 'Intermediate'],
    },
    {
        title: 'Asset Allocation Masterclass',
        description: 'The key to long-term portfolio growth.',
        longDescription: 'Go beyond stock picking and learn the science of asset allocation. Understand how to balance risk and reward across different asset classes to build a resilient, all-weather portfolio.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1624953587687-e2712703a146?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1624953587687-e2712703a146?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 210,
        tags: ['Portfolio', 'Strategy', 'Advanced'],
    },
    {
        title: 'Behavioral Finance: The Investor Mind',
        description: 'Understand the psychology behind market movements.',
        longDescription: 'Explore the psychological biases that influence investment decisions. Learn to recognize and overcome common cognitive errors to become a more rational and successful investor.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 135,
        tags: ['Psychology', 'Investing', 'Intermediate'],
    },
    {
        title: 'Crypto & Blockchain Explained',
        description: 'Demystifying the world of digital assets.',
        longDescription: 'A comprehensive introduction to blockchain technology, cryptocurrencies like Bitcoin and Ethereum, and the burgeoning world of decentralized finance (DeFi).',
        thumbnailUrl: 'https://images.unsplash.com/photo-1621452773359-fc828941b072?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1621452773359-fc828941b072?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 160,
        tags: ['Crypto', 'Beginner', 'Technology'],
    },
    {
        title: 'Options Trading for Beginners',
        description: 'Learn to use derivatives to manage risk and generate income.',
        longDescription: 'This course provides a clear, concise introduction to options trading, covering calls, puts, and basic strategies like covered calls.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
        heroImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1920&auto=format&fit=crop',
        durationMinutes: 190,
        tags: ['Options', 'Trading', 'Intermediate'],
    }
];

export const contentData: ContentItem[] = allContent.map((item, index) => {
    const educatorCycle = index % educators.length;
    const watchPercentage = Math.floor(Math.random() * 101); // 0 to 100
    const date = new Date();
    date.setDate(date.getDate() - (index * 7 + Math.floor(Math.random() * 7)));

    return {
        ...item,
        id: `content-${index + 1}`,
        educatorId: educators[educatorCycle].id,
        watchPercentage: index === 0 ? 0 : watchPercentage,
        releaseDate: date.toISOString().split('T')[0],
        viewCount: Math.floor(Math.random() * (150000 - 5000 + 1)) + 5000, // Random views between 5k and 150k
    };
});


export const featuredContent: ContentItem = contentData[0];

export const categories: Category[] = [
    {
        id: 'cat-01',
        title: 'Trending Webinars',
        content: contentData.filter(c => c.tags.includes('Live Event')),
    },
    {
        id: 'cat-02',
        title: 'Foundations of Finance',
        content: contentData.filter(c => c.tags.includes('Beginner') || c.tags.includes('Intermediate')),
    },
    {
        id: 'cat-03',
        title: 'Advanced Investment Strategies',
        content: contentData.filter(c => c.tags.includes('Advanced')),
    },
    {
        id: 'cat-04',
        title: 'Recently Added',
        content: [...contentData].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 8),
    }
];


export const shortsData: ShortItem[] = [
    {
      id: 'short-1',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-man-in-a-suit-works-on-his-laptop-34321-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      title: 'Quick Tip: Diversification',
      description: 'Never put all your eggs in one basket! A fundamental rule for long-term growth. #investing #finance #tips',
      educatorId: 'dr-ram',
      likes: 12500,
      commentsCount: 132,
      comments: [
        {
          id: 'comment-1-1',
          author: 'Anjali Sharma',
          avatarUrl: 'https://i.pravatar.cc/150?u=anjali-sharma',
          text: 'So true! I learned this the hard way.',
          likes: 28,
          timestamp: '2023-10-27T10:00:00Z',
          replies: [
            {
              id: 'reply-1-1-1',
              author: 'Vikram Singh',
              avatarUrl: 'https://i.pravatar.cc/150?u=vikram-singh',
              text: 'Same here. Diversification is key.',
              likes: 5,
              timestamp: '2023-10-27T10:05:00Z',
            }
          ]
        },
        {
          id: 'comment-1-2',
          author: 'Rohan Gupta',
          avatarUrl: 'https://i.pravatar.cc/150?u=rohan-gupta',
          text: 'What are the best ETFs for a beginner?',
          likes: 45,
          timestamp: '2023-10-27T11:20:00Z',
          replies: []
        }
      ]
    },
    {
      id: 'short-2',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-business-woman-talking-on-the-phone-in-a-large-office-34444-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
      title: 'Negotiating Your Salary',
      description: 'Know your worth and don\'t be afraid to ask for it. #career #salary #negotiation',
      educatorId: 'wealth-wizards',
      likes: 21000,
      commentsCount: 250,
      comments: [
         {
          id: 'comment-2-1',
          author: 'Priya Patel',
          avatarUrl: 'https://i.pravatar.cc/150?u=priya-patel',
          text: 'This is great advice! Confidence is everything.',
          likes: 62,
          timestamp: '2023-10-26T14:00:00Z',
          replies: []
        }
      ]
    },
    {
      id: 'short-3',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-programmers-cooperating-at-work-34407-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      title: 'Understanding Compound Interest',
      description: 'Einstein called it the 8th wonder of the world. Here\'s why. #finance101 #compounding #wealth',
      educatorId: 'market-masters',
      likes: 32800,
      commentsCount: 412,
      comments: [
        {
          id: 'comment-3-1',
          author: 'Amit Kumar',
          avatarUrl: 'https://i.pravatar.cc/150?u=amit-kumar',
          text: 'The sooner you start, the better!',
          likes: 102,
          timestamp: '2023-10-25T09:30:00Z',
          replies: [
            {
              id: 'reply-3-1-1',
              author: 'Dr. Ram',
              avatarUrl: 'https://i.pravatar.cc/150?u=dr-ram',
              text: 'Exactly, Amit. Time is your greatest asset.',
              likes: 55,
              timestamp: '2023-10-25T09:35:00Z',
            }
          ]
        }
      ]
    },
];

export const notesData: NoteItem[] = [
    {
        id: 'note-1',
        title: 'Q2 Market Analysis & Outlook',
        description: 'A comprehensive review of the second quarter market performance and our outlook for Q3. This document covers major indices, sector performance, and macroeconomic trends. <br/><br/> Access the full report here: <a href="#" class="text-cyan-400 hover:underline">Q2_Market_Report.pdf</a>',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
        documentUrl: '#',
        isSaved: false,
        authorId: 'market-masters',
        category: 'Market Reports',
        publishDate: '2023-07-05T10:00:00Z',
    },
    {
        id: 'note-2',
        title: 'Checklist for Pre-Retirement Planning',
        description: 'Are you within 5 years of retirement? Use this essential checklist to ensure all your financial ducks are in a row. Covers healthcare, estate planning, and withdrawal strategies. <br/><br/> Download the checklist: <a href="#" class="text-cyan-400 hover:underline">Retirement_Checklist.pdf</a>',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop',
        documentUrl: '#',
        isSaved: true,
        authorId: 'wealth-wizards',
        category: 'Financial Planning',
        publishDate: '2023-06-20T14:30:00Z',
    },
    {
        id: 'note-3',
        title: 'Angel Investing: Term Sheet Guide',
        description: 'A detailed guide to understanding the key components of a startup term sheet, including valuation, liquidation preference, and anti-dilution provisions. <br/><br/> Get the guide: <a href="#" class="text-cyan-400 hover:underline">Term_Sheet_Guide.pdf</a>',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-57738bdfa3a4?q=80&w=800&auto=format&fit=crop',
        documentUrl: '#',
        isSaved: false,
        authorId: 'dr-ram',
        category: 'Investing',
        publishDate: '2023-08-01T09:00:00Z',
    },
    {
        id: 'note-4',
        title: 'Tax-Loss Harvesting Strategies',
        description: 'Learn how to strategically sell investments at a loss to offset capital gains taxes. This note explains the process and the "wash-sale" rule to avoid. <br/><br/> Read more: <a href="#" class="text-cyan-400 hover:underline">Tax_Loss_Harvesting.pdf</a>',
        thumbnailUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop',
        documentUrl: '#',
        isSaved: false,
        authorId: 'market-masters',
        category: 'Tax Planning',
        publishDate: '2023-07-15T11:00:00Z',
    },
];

export const chartsData: ChartItem[] = [
    {
        id: 'chart-1',
        title: 'S&P 500 Weekly Performance',
        description: 'This chart illustrates the weekly closing prices of the S&P 500 index over the last quarter, highlighting key support and resistance levels.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
        isSaved: true,
        authorId: 'market-masters',
        category: 'Index Analysis',
        publishDate: '2023-08-10T09:00:00Z',
    },
    {
        id: 'chart-2',
        title: 'Sector Rotation Model',
        description: 'An overview of the current economic cycle and which market sectors are expected to outperform or underperform in the coming months.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        isSaved: false,
        authorId: 'market-masters',
        category: 'Market Strategy',
        publishDate: '2023-08-08T11:00:00Z',
    },
    {
        id: 'chart-3',
        title: 'VIX Volatility Index Trends',
        description: 'Analysis of the CBOE Volatility Index (VIX), often referred to as the "fear index." This chart shows recent spikes and their correlation with market downturns.',
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
        isSaved: false,
        authorId: 'dr-ram',
        category: 'Risk Management',
        publishDate: '2023-08-05T15:00:00Z',
    },
    {
        id: 'chart-4',
        title: 'Asset Class Performance YTD',
        description: 'A comparative chart showing the year-to-date performance of major asset classes, including equities, bonds, commodities, and real estate.',
        imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop',
        isSaved: false,
        authorId: 'wealth-wizards',
        category: 'Portfolio Management',
        publishDate: '2023-08-02T12:00:00Z',
    },
];

export const drRamsMessages: MessageItem[] = [
    {
        id: 'msg-1',
        authorId: 'dr-ram',
        content: 'Delivery on settlement at expiry day<br/><br/><a href="#" class="text-cyan-400 hover:underline">https://support.zerodha.com/category/trading-and-markets/trading-faqs/f-otrading/articles/policy-on-physical-settlement</a>',
        timestamp: '2025-12-03T11:53:00Z',
    },
    {
        id: 'msg-2',
        authorId: 'dr-ram',
        content: `Ask Google Colab to do the following task. Give following prompt... Enjoy the power of AI<br/><br/>
        Analyze the historical performance of a portfolio consisting of NiftyBees (30%), GoldBees (30%), and LiquidCase (40%) over the past year. Calculate the total annual return, maximum drawdown, and annualized standard deviation of the portfolio. Visualize the cumulative returns of the portfolio and export all performance metrics and daily portfolio values/cumulative returns to an Excel file.`,
        timestamp: '2025-11-27T13:04:00Z',
    },
    {
        id: 'msg-3',
        authorId: 'dr-ram',
        content: 'DOUBT: ACC and CCP<br/>Deactived',
        timestamp: '2025-11-26T11:38:00Z',
    },
    {
        id: 'msg-4',
        authorId: 'dr-ram',
        content: `The difference between gambling and trading is the CALCULATIONS.<br/>Gamblers seek multibagger returns (unrealistic expectations) and remain ignorant of risk and probability of gain. For instance, there are two options.<br/>
        Option A: Possibility to make 10 lakh, but probability 0.1<br/>
        Option B: Possibility to make profit of 2 lakhs, but probability 0.9`,
        timestamp: '2025-11-25T10:20:00Z',
    }
];

export const adminsUpdates: MessageItem[] = [
    {
        id: 'admin-1',
        authorId: 'admin',
        content: 'Welcome to the new and improved Wealthcon platform! We have redesigned the interface for a smoother, more intuitive experience. We hope you enjoy it!',
        timestamp: '2025-12-01T09:00:00Z',
    },
    {
        id: 'admin-2',
        authorId: 'admin',
        content: 'A new course, "Advanced Tax Strategies for High-Income Earners," has just been added to the Videos section. Check it out now!',
        timestamp: '2025-11-28T16:45:00Z',
    }
];
