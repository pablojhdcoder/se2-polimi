\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{ConfigurationFiles/Politecnico_Di_Milano}[2025/12/23 Politecnico SE2 submission]
\ProcessOptions\relax

%--------------------------------------------------------------------------
%	HANDLING THE STYLE OF THE THESIS
%--------------------------------------------------------------------------
\LoadClass[12pt, twoside]{book} % 12 pt font, two-sided book style
\RequirePackage[a4paper, includehead, headheight=0.6cm, inner=3.0cm ,outer=2.0cm, top=2.5cm, bottom=2.5cm]{geometry}

\RequirePackage[bf, font=onehalfspacing]{caption} % caption: FIG in bold, 1.5 line spacing in figure and table captions
\RequirePackage{xcolor} % For colored text
\RequirePackage{fancyhdr} % For custom headers and footers
\RequirePackage{tabularx} % For advanced table formatting
\newcommand{\thesisspacing}{\onehalfspacing}

% Define new command: numbered and un-numbered chapter in Polimi style. 

\let\latexchapter\chapter
%! suppress = MightBreakTexify
\renewcommand{\chapter}{\@ifstar{\polimichapterstar}{\polimichapter}}

\newcommand{\polimichapter}[1]{
    \cleardoublepage % To make sure the previous headers are passed
    \phantomsection % To help hyperref link to the right page
    \latexchapter{#1}
    \renewcommand{\headrulewidth}{0pt} %removing the horizontal line in the header
    \fancyhead[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Best Bike Paths project by Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz}}% Header
    \fancyfoot[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Copyright \textcopyright\ 2025, Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz -- All rights reserved}}
    \fancyfoot[RO, RE]{\footnotesize\textcolor[gray]{0.5}{\thepage}}
    \vspace{-1cm}
}

\newcommand{\polimichapterstar}[1]{
    \cleardoublepage % To make sure the previous headers are passed
    \phantomsection % To help hyperref link to the right page
    \latexchapter*{#1}
    \renewcommand{\headrulewidth}{0pt} %removing the horizontal line in the header
    \addcontentsline{toc}{chapter}{#1} % Also adds the chapter name to the Contents
    \fancyhead[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Best Bike Paths project by Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz}}% Header
    \fancyfoot[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Copyright \textcopyright\ 2025, Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz -- All rights reserved}}
    \fancyfoot[RO, RE]{\footnotesize\textcolor[gray]{0.5}{\thepage}}
    \vspace{-1cm}
}

% Define new command: start preamble
\newcommand{\startpreamble}{
    \pagestyle{fancy} % Change the header style
    \fancyhf{}% Clear header and footer
    \renewcommand{\chaptermark}[1]{\markboth{##1}{}} % Getting the chapter name right
    \fancyhead[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Best Bike Paths project by Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz}}% Header
    \fancyfoot[LO, LE]{\scriptsize\textcolor[gray]{0.5}{Copyright \textcopyright\ 2025, Jos\'e Mart\'inez Est\'evez, Pablo Jes\'us Herrero D\'iaz -- All rights reserved}}
    \fancyfoot[RO, RE]{\footnotesize\textcolor[gray]{0.5}{\thepage}}
    \mainmatter % Use numeric page numbering style (1, 2, 3...) for all pages
    \thesisspacing % Double or single spacing
}

%------------------------------------------------------------------------
%	BUILDING THE TITLE PAGE
%------------------------------------------------------------------------

% Remove circular stripe pattern by redefining background commands
\newcommand\BackgroundPic{} % No background for blank pages
\newcommand\BackgroundPicTR{} % No background for the title page

\RequirePackage{xkeyval} % Handling keyword options.

% Define keys for title pages
\newif\if@cosupervisorexist\@cosupervisorexistfalse
\define@key[OIST]{title}{title}{\def\thesistitle{#1}}
\define@key[OIST]{title}{name1}{\def\nameA{#1}}
\define@key[OIST]{title}{name2}{\def\nameB{#1}}
\define@key[OIST]{title}{name3}{\def\nameC{#1}}
\define@key[OIST]{title}{academicyear}{\def\academicyear{#1}}
\define@key[OIST]{title}{version}{\def\version{#1}}
\define@key[OIST]{title}{releasedate}{\def\releasedate{#1}}
\define@key[OIST]{title}{deliverable}{\def\deliverable{#1}}
\define@key[OIST]{title}{date}{\def\titledate{#1}}
\define@key[OIST]{title}{downloadpage}{\def\downloadpage{#1}}

\providecommand{\puttitle}{}
\renewcommand{\puttitle}[1]{
    \@puttitle{}{#1}
}

\providecommand{\@puttitle}{}
\renewcommand{\@puttitle}[2]{%
    \setkeys[OIST]{title}{#2}

    \begin{titlepage}
        % Removed circular stripe pattern from the title page
        \vfill
        \begin{minipage}{0.95\textwidth}
            \begin{flushleft}
                \includegraphics[width=0.7\textwidth]{PolimiLogo.png}
            \end{flushleft}
            \par\vspace{3cm}
            \noindent{\textcolor{bluepoli}{\textbf{\large{Best Bike Paths}}}}\par\vspace{1.5cm}
            \noindent{{\color{bluepoli} \singlespacing \huge \bfseries \thesistitle \par}}\vspace{1cm}
            \noindent{\large \nameA, \nameB}
        \end{minipage}
        \par
        \vspace*{\fill}
    \end{titlepage}
    
    \vspace{2cm}
    \begin{table}[h!]
        \begin{tabularx}{\textwidth}{>{\raggedleft\arraybackslash}p{0.3\textwidth} p{0.7\textwidth}}
        \hline
        \textbf{Deliverable:} & \deliverable\\
        \textbf{Title:} & \thesistitle \\
        \textbf{Authors:} & \nameA, \nameB \\
        \textbf{Version:} & \version \\ 
        \textbf{Date:} & \titledate \\
        \textbf{Download page:} & \downloadpage \\
        \textbf{Copyright:} & Copyright \textcopyright\ 2025, \nameA, \nameB -- All rights reserved \\
        \hline
        \end{tabularx}
    \end{table}
}

\newcommand\blankpage{%
    \null
    % No background applied to blank pages
    \thispagestyle{empty}%
    \addtocounter{page}{-1}%
    \newpage
}
