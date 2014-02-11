import com.typesafe.startscript.StartScriptPlugin

seq(StartScriptPlugin.startScriptForClassesSettings: _*)

organization := "raimohanska"

name := "turtleroy"

version := "0.1-SNAPSHOT"

scalaVersion := "2.9.1"

seq(webSettings :_*)

resolvers += "repo.novus rels" at "http://repo.novus.com/snapshots/"

resolvers += "oss.sonatype.org" at "https://oss.sonatype.org/content/groups/scala-tools/"

libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra-specs2" % "2.0.1",
  "org.scalatra" %% "scalatra" % "2.0.1",
  "net.liftweb" %% "lift-json" % "2.4-M4",
  "org.specs2" %% "specs2" % "1.6.1" % "test",
  "org.specs2" %% "specs2-scalaz-core" % "6.0.1" % "test",
  "org.eclipse.jetty" % "jetty-webapp" % "7.4.5.v20110725" % "container",
  "javax.servlet" % "servlet-api" % "2.5" % "provided",
  "net.databinder" %% "dispatch-http" % "0.8.7",
  "com.mongodb.casbah" %% "casbah" % "2.1.5-1",
  "com.novus" %% "salat-core" % "0.0.8-SNAPSHOT",
  "ch.qos.logback" % "logback-classic" % "1.0.0"
)

port in container.Configuration := 8070
