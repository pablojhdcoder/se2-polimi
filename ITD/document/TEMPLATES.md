# ITD Templates Documentation

This document provides templates and guidelines for creating content in the Integration Testing Document (ITD).

## Table of Contents

1. [Chapter Template](#chapter-template)
2. [Integration Test Case Template](#integration-test-case-template)
3. [Effort Spent Table Template](#effort-spent-table-template)
4. [Figure Template](#figure-template)
5. [Cross-Reference Guidelines](#cross-reference-guidelines)

---

## Chapter Template

### File Structure

**File:** `Chapters/ch##_chapter_name.tex`

### Basic Template

```latex
\section{Section Title}
\label{sec:section_label}%

[Content here]

\subsection{Subsection Title}
\label{subsec:subsection_label}%

[Content here]

\subsubsection{Subsubsection Title}
\label{subsubsec:subsubsection_label}%

[Content here]
```

### Guidelines

- Always include a `\label{}` command after each section/subsection
- Use descriptive labels following the pattern: `sec:`, `subsec:`, `subsubsec:`
- Use `%` at the end of `\label{}` lines to avoid unwanted spaces
- Maintain consistent formatting with existing chapters

---

## Integration Test Case Template

### Table-Based Specification

This template follows the style used in the JhaBhatiaSharma ITD reference document.

```latex
\begin{table}[ht]
\centering
\begin{tabular}{|p{3.5cm}|p{4cm}|p{3.5cm}|p{5cm}|}
\hline
\multicolumn{4}{|c|}{\textbf{[Component/Service Name] Integration Tests}} \\ 
\hline
\textbf{Functionality} & \textbf{Test Description} & \textbf{Input/Conditions} & \textbf{Assertions/Expected Outcome} \\
\hline
\multirow{N}{*}{\texttt{functionName}}
 & Test case 1 description
 & Input/conditions for test 1
 & Expected outcome for test 1 \\ \cline{2-4}
 & Test case 2 description
 & Input/conditions for test 2
 & Expected outcome for test 2 \\
\hline
\end{tabular}
\caption{[Component/Service Name] Integration Test Cases}
\label{tab:test_cases_component_name}
\end{table}
```

### Column Width Guidelines

- **Functionality:** `p{3.5cm}` - Function or method name
- **Test Description:** `p{4cm}` - Brief description of what is being tested
- **Input/Conditions:** `p{3.5cm}` - Test inputs and preconditions
- **Assertions/Expected Outcome:** `p{5cm}` - Expected results and assertions

### Example

```latex
\begin{table}[ht]
\centering
\begin{tabular}{|p{3.5cm}|p{4cm}|p{3.5cm}|p{5cm}|}
\hline
\multicolumn{4}{|c|}{\textbf{User Management Service Integration Tests}} \\ 
\hline
\textbf{Functionality} & \textbf{Test Description} & \textbf{Input/Conditions} & \textbf{Assertions/Expected Outcome} \\
\hline
\multirow{2}{*}{\texttt{registerUser}}
 & Register new user successfully
 & Valid user details (email, password, name)
 & Returns 201, user registered successfully \\ \cline{2-4}
 & Handle duplicate email
 & Existing email address
 & Returns 400, message: "User already exists" \\
\hline
\end{tabular}
\caption{User Management Service Integration Test Cases}
\label{tab:test_cases_user_management}
\end{table}
```

---

## Effort Spent Table Template

### File Location

**File:** `Chapters/ch07_effort_spent.tex`

### Template

```latex
\section{Effort Spent}
\label{sec:effort_spent}%

This chapter reports the effort spent by each team member during the development of this Integration Testing Document.

\begin{table}[H]
    \centering
    \begin{tabular}{|p{0.3\textwidth}|p{0.5\textwidth}|c|}
        \hline
        \textbf{Team Member} & \textbf{Main tasks (ITD)} & \textbf{Hours Spent} \\ 
        \hline
        José Martínez Estévez &
        [List of main tasks and chapters] & [Hours] \\ 
        \hline
        Pablo Jesús Herrero Díaz &
        [List of main tasks and chapters] & [Hours] \\ 
        \hline
    \end{tabular}
    \caption{Effort spent by each member of the group for the ITD.}
    \label{tab:effort_spent_itd}
\end{table}
```

### Guidelines

- Use `[H]` placement specifier to ensure the table appears exactly where defined
- Column widths: 30% for Team Member, 50% for Main tasks, remaining for Hours
- List main tasks clearly, including chapter numbers and component names
- Round hours to whole numbers or use one decimal place

---

## Figure Template

### Basic Figure Template

```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{Images/Diagrams/Sequence_Backend_UserRegistration.png}
    \caption{Integration sequence diagram for User Registration use case}
    \label{fig:sequence_user_registration}
\end{figure}
```

### Guidelines

- Use `[H]` for figures that must appear exactly where defined
- Use `[ht]` or `[htbp]` for figures that can float
- Image width: typically `0.8\textwidth` or `0.9\textwidth` for diagrams
- Captions should be descriptive and include context
- Labels follow pattern: `fig:descriptive_name`

### Sequence Diagram Naming

- **Backend sequences:** `Sequence_Backend_DescriptiveName.png`
- **Client sequences:** `Sequence_Client_DescriptiveName.png`
- **End-to-End sequences:** `Sequence_E2E_DescriptiveName.png`
- **Error handling:** `Sequence_Error_DescriptiveName.png`

---

## Cross-Reference Guidelines

### Chapter References

Use `\Cref{}` (capital C) for chapter and section references:

```latex
As described in \Cref{ch:integration_strategy}, the integration follows a Bottom-Up approach.
```

### Figure and Table References

Use `\cref{}` (lowercase c) for figure and table references:

```latex
The integration flow is shown in \cref{fig:sequence_user_registration}.
Test cases are documented in \cref{tab:test_cases_user_management}.
```

### Label Naming Conventions

- **Chapters:** `ch:chapter_name` (e.g., `ch:integration_strategy`)
- **Sections:** `sec:section_name` (e.g., `sec:data_layer_integration`)
- **Subsections:** `subsec:subsection_name` (e.g., `subsec:dbms_integration`)
- **Figures:** `fig:figure_name` (e.g., `fig:sequence_user_registration`)
- **Tables:** `tab:table_name` (e.g., `tab:test_cases_user_management`)

### Guidelines

- Use lowercase with underscores for multi-word labels
- Be descriptive but concise
- Maintain consistency across the document
- Always include `%` after `\label{}` commands

---

## Terminology Consistency

### Standard Terms

- **Integration Test** (not "Integration Testing" as a noun)
- **Test Case** (not "TestCase" or "test-case")
- **Component Integration** (not "Component Integration Testing")
- **End-to-End** (not "E2E" in body text, but acceptable in labels/IDs)
- **Use Case** (abbreviated as "UC" only in references like "UC1")
- **API Gateway** (not "API gateway" or "api-gateway")

### Acronyms

- First use: Full term followed by acronym in parentheses: "Integration Testing Document (ITD)"
- Subsequent uses: Acronym only: "ITD"
- In tables and captions: Acronym is acceptable

---

## File Naming Conventions

### Chapter Files

- Format: `ch##_descriptive_name.tex`
- Examples:
  - `ch01_introduction.tex`
  - `ch02_integration_strategy.tex`
  - `ch07_effort_spent.tex`

### Image Files

- Sequence diagrams: `Sequence_Component_UseCase.png`
- Integration diagrams: `Integration_DescriptiveName.png`
- General images: PascalCase descriptive names

### Test Case Files (in code/test_cases/)

- Format: `test_case_##_component_description.md`
- Examples:
  - `test_case_01_user_management_registration.md`
  - `test_case_02_trip_management_create.md`

---

## Best Practices

1. **Consistency:** Follow existing patterns in the document
2. **Clarity:** Use clear, descriptive labels and captions
3. **Completeness:** Ensure all figures and tables have captions and labels
4. **Cross-references:** Verify all `\Cref{}` and `\cref{}` references resolve correctly
5. **Language:** All content must be in English
6. **Formatting:** Maintain consistent spacing and indentation

---

## Revision History

- **Version 1.0** (27 January 2026): Initial template documentation created

---

**Note:** This document should be updated as templates evolve during the ITD development process.
