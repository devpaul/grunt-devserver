Feature: Command line usage
  As a user I want to be able to run grunt-devserver
  from the command-line using different command-line arguments
  and expect a server to be started using those options

Scenario: invoked without parameters
  Given I am in the assets folder
  When I run devserver from the command line
  Then I expect a server to be started